using AMMS.Domain.Common.Kernel;
using AMMS.Domain.Common.Models;
using AMMS.Domain.Membership.Models;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;

namespace AMMS.Domain.Common
{
    public class CommonContext
    {
        public IMongoCollection<Tenant> Tenants { get; }

        public IMongoCollection<Branch> Branches { get; }

        public IMongoCollection<Settings> Settings { get; }

        static CommonContext()
        {
            BsonClassMap.RegisterClassMap(EntityMap.Map);
            BsonClassMap.RegisterClassMap(SettingsMap.Map);
            BsonClassMap.RegisterClassMap(TenantMap.Map);
            BsonClassMap.RegisterClassMap(BranchMap.Map);
            BsonClassMap.RegisterClassMap(AddressMap.Map);
            BsonClassMap.RegisterClassMap(PersonMap.Map);
        }

        public CommonContext(IMongoDatabase database)
        {
            Tenants = database.GetCollection<Tenant>("tenants");
            Branches = database.GetCollection<Branch>("branches");
            Settings = database.GetCollection<Settings>("settings");
        }

        public (string tenantId, string branchId, string userDefaultPassword) Seed()
        {
            var tenant = Tenants.AsQueryable().FirstOrDefault();
            if (tenant == null)
            {
                tenant = new Tenant("Rapide");
                Tenants.InsertOne(tenant);
            }

            var branch = Branches.AsQueryable().FirstOrDefault(x => x.TenantId == tenant.Id);
            if (branch == null)
            {
                branch = new Branch("Cubao, Tuazon Branch", tenant.Id);
                Branches.InsertOne(branch);
            }

            var userSettings = Settings.AsQueryable().OfType<UserSettings>().FirstOrDefault(x => x.TenantId == tenant.Id);
            if (userSettings == null)
            {
                userSettings = new UserSettings(tenant.Id, "sample");
                Settings.InsertOne(userSettings);
            }

            return (tenant.Id, branch.Id, userSettings.DefaultPassword);
        }
    }
}