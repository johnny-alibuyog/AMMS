using AMMS.Domain.Common;
using AMMS.Domain.Membership;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.Core.Events;
using Serilog;
using System;

namespace AMMS.Domain
{
    public class DbContext
    {
        public CommonContext Common { get; }

        public MembershipContext Membership { get; }

        static DbContext()
        {
            ConventionRegistry.Register(
                name: "CamelCase",
                filter: x => true,
                conventions: new ConventionPack()
                {
                    new CamelCaseElementNameConvention(),
                }
            );

            // not working https://stackoverflow.com/questions/6996399/storing-enums-as-strings-in-mongodb
            ConventionRegistry.Register(
                name: "EnumStringConvention",
                filter: x => true,
                conventions: new ConventionPack()
                {
                    new EnumRepresentationConvention(BsonType.String)
                }
            );
        }

        public DbContext(IOptions<DbConfig> dbConfig, ILogger log)
        {
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

            Common = new CommonContext(database);

            Membership = new MembershipContext(database);

            SeedData();
        }

        public void SeedData()
        {
            var common = Common.Seed();

            Membership.Seed(common);
        }
    }

    public class DbConfig
    {
        public string Database { get; set; }

        public string ConnectionString { get; set; }
    }
}
