using AMMS.Domain.Common.Kernel;
using AMMS.Domain.Common.Models;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;
using System.Threading.Tasks;

namespace AMMS.Domain.Common
{
    public class CommonContext
    {
        public IMongoCollection<Settings> Settings { get; }

        public IMongoQueryable<Settings> QueryableSettings => Settings.AsQueryable();

        static CommonContext()
        {
            BsonClassMap.RegisterClassMap(EntityMap.Map);

            BsonClassMap.RegisterClassMap(SettingsMap.Map);

            BsonClassMap.RegisterClassMap(AddressMap.Map);

            BsonClassMap.RegisterClassMap(PersonMap.Map);
        }

        public CommonContext(IMongoDatabase database)
        {
            Settings = database.GetCollection<Settings>("settings");
        }

        //public async Task CreateIndexes()
        //{
        //    Tenants.Indexes.CreateOneAsync()
        //}

        //internal async Task<string> SeedSuperTenant()
        //{
        //    if (await Tenants.AsQueryable().AnyAsync(x => x.Id == Tenant.SuperTenant.Id))
        //    {
        //        await Tenants.InsertOneAsync(Tenant.SuperTenant);
        //    }

        //    if (await Branches.AsQueryable().AnyAsync(x => x.Id == Branch.SuperBranch.Id))
        //    {
        //        await Branches.InsertOneAsync(Branch.SuperBranch);
        //    }

        //    var userSettings = await Settings.AsQueryable().OfType<UserSettings>()
        //        .FirstOrDefaultAsync(x => x.TenantId == Tenant.SuperTenant.Id);

        //    if (userSettings == null)
        //    {
        //        userSettings = new UserSettings(
        //            tenantId: Tenant.SuperTenant.Id, 
        //            defaultPassword: new PasswordGenerator().Generate(8, 10)
        //        );

        //        await Settings.InsertOneAsync(userSettings);
        //    }

        //    return userSettings.DefaultPassword;
        //}

        //public async Task<(string tenantId, string branchId, string userDefaultPassword)> Seed()
        //{
        //    var tenant = await Tenants.AsQueryable().FirstOrDefaultAsync();

        //    if (tenant == null)
        //    {
        //        tenant = new Tenant("rapide", "Rapide");

        //        await Tenants.InsertOneAsync(tenant);
        //    }

        //    var branch = await Branches.AsQueryable().FirstOrDefaultAsync(x => x.TenantId == tenant.Id);

        //    if (branch == null)
        //    {
        //        branch = new Branch("cubao", "Cubao, Tuazon Branch", tenant.Id);

        //        await Branches.InsertOneAsync(branch);
        //    }

        //    var userSettings = await Settings.AsQueryable()
        //        .OfType<UserSettings>()
        //        .FirstOrDefaultAsync(x => x.TenantId == tenant.Id);

        //    if (userSettings == null)
        //    {
        //        userSettings = new UserSettings(tenant.Id, "sample");

        //        await Settings.InsertOneAsync(userSettings);
        //    }

        //    return (tenant.Id, branch.Id, userSettings.DefaultPassword);
        //}
    }
}