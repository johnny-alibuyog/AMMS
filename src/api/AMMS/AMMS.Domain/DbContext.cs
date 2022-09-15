using AMMS.Domain.Common;
using AMMS.Domain.Membership;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using Serilog;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AMMS.Domain;

public class DbContext
{
    public CommonDbContext Common { get; }

    public MembershipDbContext Membership { get; }

    public DbContext(IOptions<DbConfig> dbConfig, ILogger log, IClassMapInitializer map)
    {
        map.EnsureInitialization();

        var settings = new MongoClientSettings()
        {
            Server = new MongoServerAddress("localhost"),
            ClusterConfigurator = cb =>
            {
                cb.Subscribe<CommandSucceededEvent>(e =>
                {
                    if (e.Duration == TimeSpan.FromMilliseconds(100))
                    {
                        log.Warning($"Command {e.CommandName} is taking too long ({e.Duration.Seconds} seconds) with result {e.Reply.ToJson()}");
                    }
                });

                cb.Subscribe<CommandFailedEvent>(e =>
                {
                    log.Warning("Command {commandName} failed wiht an exception {@exception}", e.CommandName, e.Failure);
                });
            }
        };

        var database = new MongoClient(dbConfig.Value.ConnectionString)
            .GetDatabase(dbConfig.Value.Database);

        Common = new CommonDbContext(database);

        Membership = new MembershipDbContext(database);

        SeedSuper().Wait();
    }

    public async Task SeedSuper()
    {
        await Membership.SeedSuper(Common.Settings);
    }
}

public class DbConfig
{
    public string Database { get; set; }

    public string ConnectionString { get; set; }
}

public interface IClassMap
{
    void Apply();
}

public abstract class ClassMap<T> : IClassMap
{
    public void Apply()
    {
        if (!BsonClassMap.IsClassMapRegistered(typeof(T)))
            BsonClassMap.RegisterClassMap<T>(Map);
    }

    public abstract void Map(BsonClassMap<T> cm);
}

public interface IClassMapInitializer
{
    void EnsureInitialization();
}

public class ClassMapInitializer : IClassMapInitializer
{
    private static bool _isInitialized = false;

    private static readonly object _locker = new object();

    private readonly IEnumerable<IClassMap> _classMaps;

    public ClassMapInitializer(IEnumerable<IClassMap> classMaps)
    {
        _classMaps = classMaps;
    }

    public void EnsureInitialization()
    {
        lock (_locker)
        {
            if (_isInitialized)
            {
                return;
            }

            RegisterConventions();

            foreach (var classMap in _classMaps)
            {
                classMap.Apply();
            }

            _isInitialized = true;
        }
    }

    private void RegisterConventions()
    {
        ConventionRegistry.Register(
            name: "CamelCase",
            filter: x => true,
            conventions: new ConventionPack()
            {
                new CamelCaseElementNameConvention(),
            }
        );

        // not working on complex type
        // https://stackoverflow.com/questions/6996399/storing-enums-as-strings-in-mongodb
        ConventionRegistry.Register(
            name: "EnumStringConvention",
            filter: x => true,
            conventions: new ConventionPack()
            {
                new EnumRepresentationConvention(BsonType.String)
            }
        );
    }
}
