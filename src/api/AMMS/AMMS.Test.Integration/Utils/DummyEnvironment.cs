using AMMS.Domain;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Messages.Branches;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Client;
using System.Threading.Tasks;

namespace AMMS.Test.Integration.Utils
{
    public class DummyEnvironment
    {
        private readonly Api _api; /* this is the api used to create environment using super_user */

        private readonly FakerContext _faker;

        public Tenant Tenant { get; private set; }

        public Branch Branch { get; private set; }

        public User User { get; private set; }

        public string DefaultPassword { get; }

        public DummyEnvironment()
        {
            _api = ApiProvider.CreateApi();
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
                GetBranch = _api.Membership.Branches.Send(new BranchGet.Request() { Id = response.BranchId}),
                GetUser = _api.Membership.Users.Send(new UserGet.Request() { Id = response.UserId }),
            };

            await Task.WhenAll(tasks.GetTenant, tasks.GetBranch, tasks.GetUser);

            (Tenant, Branch, User) = (tasks.GetTenant.Result, tasks.GetBranch.Result, tasks.GetUser.Result);
        }

        public async Task Clean()
        {
            await _api.Membership.Tenants.Send(new TenantEnvironmentDelete.Request() { TenantId = Tenant.Id });
        }
    }
}
