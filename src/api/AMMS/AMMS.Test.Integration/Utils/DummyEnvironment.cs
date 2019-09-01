using AMMS.Domain;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Messages.Branches;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Roles;
using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Host.Common.Client;
using System.Threading.Tasks;

namespace AMMS.Test.Integration.Utils
{
    public class DummyEnvironment
    {
        private readonly ClientApi _api; /* this is the api used to create environment using super_user */

        private readonly FakerContext _faker;

        public Tenant Tenant { get; private set; }

        public Branch Branch { get; private set; }

        public User User { get; private set; }

        public Role Role { get; private set; }

        public string DefaultPassword { get; }

        public DummyEnvironment()
        {
            _api = ClientApiProvider.CreateClientApi();
            _faker = new FakerContext();
            DefaultPassword = new PasswordGenerator().Generate();
        }

        public async Task Initialize()
        {
            var request = new TenantEnvironmentCreate.Request()
            {
                Tenant = _faker.Membership.Tenant.Generate(),
                Branch = _faker.Membership.Branch.Generate(),
                User = _faker.Membership.User.Generate(),
                DefaultPassword = DefaultPassword
            };

            var response = await _api.Membership.Tenants.Send(request);

            var tasks = new
            {
                GetTenant = _api.Membership.Tenants.Send(new TenantGet.Request() { Id = response.TenantId }),
                GetBranch = _api.Membership.Branches.Send(new BranchGet.Request() { Id = response.BranchId }),
                GetRole = _api.Membership.Roles.Send(new RoleGet.Request() { Id = response.RoleId }),
                GetUser = _api.Membership.Users.Send(new UserGet.Request() { Id = response.UserId }),
            };

            await Task.WhenAll(tasks.GetTenant, tasks.GetBranch, tasks.GetRole, tasks.GetUser);

            (Tenant, Branch, Role, User) = (tasks.GetTenant.Result, tasks.GetBranch.Result, tasks.GetRole.Result, tasks.GetUser.Result);
        }

        public async Task Clean()
        {
            await _api.Membership.Tenants.Send(new TenantEnvironmentDelete.Request() { TenantId = Tenant.Id });
        }
    }
}
