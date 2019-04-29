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
    public class TenantEnvironmentCreation
    {
        private Context _ctx ;

        [Before("TenantEnvironment", "Creation")]
        public void Before()
        {
            _ctx = new Context();
        }

        [When(@"a tenant environment is created")]
        public async Task WhenATenantEnvironmentIsCreated()
        {
            var request = new TenantEnvironmentCreate.Request()
            {
                Tenant = _ctx.Faker.Membership.Tenant.Generate(),
                Branch = _ctx.Faker.Membership.Branch.Generate(),
                User = _ctx.Faker.Membership.User.Generate(),
                DefaultPassword = _ctx.PasswordGenerator.Generate()
            };

            var response = await _ctx.Api.Membership.Tenants.Send(request);

            var tasks = new
            {
                GetTenant = _ctx.Api.Membership.Tenants.Send(new TenantGet.Request() { Id = response.TenantId }),
                GetBranch = _ctx.Api.Membership.Branches.Send(new BranchGet.Request() { Id = response.BranchId }),
                GetUser = _ctx.Api.Membership.Users.Send(new UserGet.Request() { Id = response.UserId })
            };

            await Task.WhenAll(tasks.GetTenant, tasks.GetBranch, tasks.GetUser);

            _ctx.CaptureInsertingState((request.Tenant, request.Branch, request.User));

            _ctx.CaptureInsertedState((tasks.GetTenant.Result, tasks.GetBranch.Result, tasks.GetUser.Result));
        }

        [Then(@"should contain tenant, branch and an admin user")]
        public void ThenShouldContainTenantBranchAndAnAdminUser()
        {
            Assert.AreEqual(_ctx.InsertedTenant.Id, _ctx.InsertedBranch.TenantId);
            Assert.AreEqual(_ctx.InsertedTenant.Id, _ctx.InsertedUser.TenantId);
            Assert.AreEqual(_ctx.InsertingTenant.Code, _ctx.InsertedTenant.Code);
            Assert.AreEqual(_ctx.InsertingTenant.Name, _ctx.InsertedTenant.Name);
            Assert.AreEqual(_ctx.InsertingBranch.Code, _ctx.InsertedBranch.Code);
            Assert.AreEqual(_ctx.InsertingBranch.Name, _ctx.InsertedBranch.Name);
            Assert.AreEqual(_ctx.InsertingUser.Username, _ctx.InsertedUser.Username);
            Assert.AreEqual(_ctx.InsertingUser.Person, _ctx.InsertedUser.Person);
            Assert.AreEqual(_ctx.InsertingUser.HomeAddress, _ctx.InsertedUser.HomeAddress);
        }

        [Then(@"the tenant environment is deletable")]
        public void ThenTheTenantEnvironmentIsDeletable()
        {
            Assert.DoesNotThrowAsync(async () => await _ctx.Api.Membership.Tenants.Send(new TenantEnvironmentDelete.Request() { TenantId = _ctx.InsertedTenant.Id }));
        }


        private class Context
        {
            public Api Api => ApiProvider.CreateApi();

            public PasswordGenerator PasswordGenerator => new PasswordGenerator();

            public FakerContext Faker => new FakerContext();

            public Tenant InsertingTenant { get; private set; }

            public Branch InsertingBranch { get; private set; }

            public User InsertingUser { get; private set; }

            public Tenant InsertedTenant { get; private set; }

            public Branch InsertedBranch { get; private set; }

            public User InsertedUser { get; private set; }

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
