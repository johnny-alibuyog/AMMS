using AMMS.Domain.Common.Models;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership
{
    public class MembershipContext
    {
        public IMongoCollection<Tenant> Tenants { get; }

        public IMongoCollection<Branch> Branches { get; }

        public IMongoCollection<User> Users { get; }

        public IMongoCollection<Role> Roles { get; }

        public IMongoQueryable<Tenant> QueryableTenants => Tenants.AsQueryable();

        public IMongoQueryable<Branch> QueryableBranches => Branches.AsQueryable();

        public IMongoQueryable<User> QueryableUsers => Users.AsQueryable();

        public IMongoQueryable<Role> QueryableRoles => Roles.AsQueryable();


        static MembershipContext()
        {
            BsonClassMap.RegisterClassMap(TenantMap.Map);

            BsonClassMap.RegisterClassMap(BranchMap.Map);

            BsonClassMap.RegisterClassMap(PermissionMap.Map);

            BsonClassMap.RegisterClassMap(RoleMap.Map);

            BsonClassMap.RegisterClassMap(UserMap.Map);
        }

        public MembershipContext(IMongoDatabase database)
        {
            Tenants = database.GetCollection<Tenant>("tenants");

            Branches = database.GetCollection<Branch>("branches");

            Users = database.GetCollection<User>("users");

            Roles = database.GetCollection<Role>("roles");
        }

        internal async Task SeedSuper(IMongoCollection<Settings> settings)
        {
            if (!await Tenants.AsQueryable().AnyAsync(x => x.Id == Tenant.SuperTenant.Id))
            {
                await Tenants.InsertOneAsync(Tenant.SuperTenant);
            }

            if (!await Branches.AsQueryable().AnyAsync(x => x.Id == Branch.SuperBranch.Id))
            {
                await Branches.InsertOneAsync(Branch.SuperBranch);
            }

            var userSettings = await settings.AsQueryable().OfType<UserSettings>()
                .FirstOrDefaultAsync(x => x.TenantId == Tenant.SuperTenant.Id);

            if (userSettings == null)
            {
                userSettings = new UserSettings(
                    tenantId: Tenant.SuperTenant.Id,
                    defaultPassword: new PasswordGenerator().Generate(8, 10)
                );

                await settings.InsertOneAsync(userSettings);
            }


            if (!await Roles.AsQueryable().AnyAsync(x => x.Id == Role.SuperRole.Id))
            {
                await Roles.InsertOneAsync(Role.SuperRole);
            }

            if (!await Users.AsQueryable().AnyAsync(x => x.Id == User.SuperUser.Id))
            {
                // TODO: uncomment this soon. password should be dynamically set here
                //User.SuperUser.SetPassword(new HashProvider(), userSettings.DefaultPassword);

                await Users.InsertOneAsync(User.SuperUser);
            }
        }

        //internal async Task Seed((string tenantId, string branchId, string userDefaultPassword) common)
        //{
        //    var role = await Roles.AsQueryable().FirstOrDefaultAsync(x => x.TenantId == common.tenantId && x.Name == "Admin");

        //    if (role == null)
        //    {
        //        role = new Role(
        //            name: "Admin",
        //            tenantId: common.tenantId,
        //            permissions: Permission.Template
        //        );

        //        await Roles.InsertOneAsync(role);
        //    }

        //    var user = await Users.AsQueryable().FirstOrDefaultAsync(x =>
        //        x.TenantId == common.tenantId &&
        //        x.Username == "admin"
        //    );

        //    if (user == null)
        //    {
        //        user = new User(
        //            tenantId: common.tenantId,
        //            username: "admin",
        //            person: new Person(
        //                firstName: "Admin",
        //                lastName: "Sample",
        //                middleName: "",
        //                birthDate: DateTime.UtcNow
        //            ),
        //            homeAddress: new Address(
        //                street: "Street",
        //                barangay: "Barangay",
        //                city: "City",
        //                province: "Province",
        //                region: "Region",
        //                country: "Country",
        //                zipCode: "ZipCode"
        //            ),
        //            roleIds: new[] { role.Id },
        //            branchIds: new[] { common.branchId }
        //        );

        //        user.SetPassword(new HashProvider(), common.userDefaultPassword);

        //        await Users.InsertOneAsync(user);
        //    }
        //}
    }
}
