using AMMS.Domain.Common.Models;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership;

public class MembershipDbContext
{
    public IMongoCollection<Tenant> Tenants { get; }

    public IMongoCollection<Branch> Branches { get; }

    public IMongoCollection<User> Users { get; }

    public IMongoCollection<Role> Roles { get; }

    public MembershipDbContext(IMongoDatabase database)
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

        var userSettings = await settings.AsQueryable().OfType<TenantUserSettings>()
            .FirstOrDefaultAsync(x => x.TenantId == Tenant.SuperTenant.Id);

        if (userSettings == null)
        {
            userSettings = new TenantUserSettings(
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
}
