using AMMS.Domain;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Messages.Branches;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Client;
using NUnit.Framework;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Membership
{
    [Binding]
    public class TenantEnvironmentOperations
    {
        private readonly Api _api;

        private readonly State _state;

        private readonly FakerContext _faker;

        public TenantEnvironmentOperations(ScenarioContext scenarioContext)
        {
            _api = ApiProvider.CreateApi();
            _state = new State(scenarioContext);
            _faker = new FakerContext();
        }

        [When(@"a tenant environment is created")]
        public async Task WhenATenantEnvironmentIsCreated()
        {
            var request = new TenantEnvironmentCreate.Request()
            {
                Tenant = _faker.Membership.Tenant.Generate(),
                Branch = _faker.Membership.Branch.Generate(),
                User = _faker.Membership.User.Generate(),
                DefaultPassword = new PasswordGenerator().Generate()
            };

            var response = await _api.Membership.Tenants.Send(request);

            var tasks = new
            {
                GetTenant = _api.Membership.Tenants.Send(new TenantGet.Request() { Id = response.TenantId }),
                GetBranch = _api.Membership.Branches.Send(new BranchGet.Request() { Id = response.BranchId }),
                GetUser = _api.Membership.Users.Send(new UserGet.Request() { Id = response.UserId })
            };

            await Task.WhenAll(tasks.GetTenant, tasks.GetBranch, tasks.GetUser);

            _state.CaptureInsertingState((request.Tenant, request.Branch, request.User));

            _state.CaptureInsertedState((tasks.GetTenant.Result, tasks.GetBranch.Result, tasks.GetUser.Result));
        }

        [Then(@"should contain tenant, branch and an admin user")]
        public void ThenShouldContainTenantBranchAndAnAdminUser()
        {
            Assert.AreEqual(_state.InsertedTenant.Id, _state.InsertedBranch.TenantId);
            Assert.AreEqual(_state.InsertedTenant.Id, _state.InsertedUser.TenantId);
            Assert.AreEqual(_state.InsertingTenant.Code, _state.InsertedTenant.Code);
            Assert.AreEqual(_state.InsertingTenant.Name, _state.InsertedTenant.Name);
            Assert.AreEqual(_state.InsertingBranch.Code, _state.InsertedBranch.Code);
            Assert.AreEqual(_state.InsertingBranch.Name, _state.InsertedBranch.Name);
            Assert.AreEqual(_state.InsertingUser.Username, _state.InsertedUser.Username);
            Assert.AreEqual(_state.InsertingUser.Person, _state.InsertedUser.Person);
            Assert.AreEqual(_state.InsertingUser.HomeAddress, _state.InsertedUser.HomeAddress);
        }

        [Then(@"the tenant environment is deletable")]
        public void ThenTheTenantEnvironmentIsDeletable()
        {
            Assert.DoesNotThrowAsync(async () => await _api.Membership.Tenants.Send(new TenantEnvironmentDelete.Request() { TenantId = _state.InsertedTenant.Id }));
        }

        private class State
        {
            private readonly ScenarioContext _keyValues;

            public State(ScenarioContext keyValues) => _keyValues = keyValues;

            public Tenant InsertingTenant
            {
                get => (Tenant)_keyValues[nameof(InsertingTenant)];
                private set => _keyValues[nameof(InsertingTenant)] = value;
            }

            public Branch InsertingBranch
            {
                get => (Branch)_keyValues[nameof(InsertingBranch)];
                private set => _keyValues[nameof(InsertingBranch)] = value;
            }

            public User InsertingUser
            {
                get => (User)_keyValues[nameof(InsertingUser)];
                private set => _keyValues[nameof(InsertingUser)] = value;
            }

            public Tenant InsertedTenant
            {
                get => (Tenant)_keyValues[nameof(InsertedTenant)];
                private set => _keyValues[nameof(InsertedTenant)] = value;
            }

            public Branch InsertedBranch
            {
                get => (Branch)_keyValues[nameof(InsertedBranch)];
                private set => _keyValues[nameof(InsertedBranch)] = value;
            }

            public User InsertedUser
            {
                get => (User)_keyValues[nameof(InsertedUser)];
                private set => _keyValues[nameof(InsertedUser)] = value;
            }

            public void CaptureInsertingState((Tenant tenant, Branch branch, User user) inserting)
            {
                InsertingTenant = inserting.tenant;
                InsertingBranch = inserting.branch;
                InsertingUser = inserting.user;
            }

            public void CaptureGeneratedIds(TenantEnvironmentCreate.Response container)
            {
                InsertingTenant.Set(x => x.Id, container.TenantId);
                InsertingBranch.Set(x => x.Id, container.BranchId);
                InsertingUser.Set(x => x.Id, container.UserId);
            }

            public void CaptureInsertedState((Tenant tenant, Branch branch, User user) inserted)
            {
                InsertedTenant = inserted.tenant;
                InsertedBranch = inserted.branch;
                InsertedUser = inserted.user;
            }
        }
    }
}
