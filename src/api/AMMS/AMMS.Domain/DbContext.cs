using AMMS.Domain.Common;
using AMMS.Domain.Users;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace AMMS.Domain
{
    public class DbContext
    {
        public CommonContext CommonContext { get; }

        public UserContext UserContext { get; }

        static DbContext()
        {
            ConventionRegistry.Register(
                name: "camelCase",
                filter: x => true,
                conventions: new ConventionPack()
                {
                    new CamelCaseElementNameConvention(),
                }
            );
        }

        public DbContext(IOptions<DbConfig> dbConfig)
        {
            var database = new MongoClient(dbConfig.Value.ConnectionString)
                .GetDatabase(dbConfig.Value.Database);

            this.CommonContext = new CommonContext();
            this.UserContext = new UserContext(database);
        }
    }

    public class DbConfig
    {
        public string Database { get; set; }

        public string ConnectionString { get; set; }
    }
}
