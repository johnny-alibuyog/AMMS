using AMMS.Domain;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Host.Common.Client;
using AMMS.Test.Integration.Utils;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Membership
{
    [Binding]
    public class UserOperations
    {
        private ClientApi _api;

        private readonly CrudStateContainer<string, User> _state;

        private DummyEnvironment _env;

        public UserOperations(ScenarioContext scenarioContext)
        {
            _state = new CrudStateContainer<string, User>(scenarioContext);
        }

        [Before("UserCrud")]
        public async Task Before()
        {
            _env = new DummyEnvironment();

            await _env.Initialize();

            _api = ApiProvider.CreateApi(_env);
        }

        [After("UserCrud")]
        public async Task After()
        {
            await _env.Clean();
        }

        [Given(@"a user has been created")]
        public async Task GivenAUserHasBeenCreated()
        {
            var fakerUser = new FakerContext().Membership.User.Generate();

            var request = new UserCreate.Request()
            {
                TenantId = _env.Tenant.Id,
                Username = fakerUser.Username,
                Person = fakerUser.Person,
                HomeAddress = fakerUser.HomeAddress,
                RoleIds = new List<string>() { _env.Role.Id },
                BranchIds = new List<string>() { _env.Branch.Id }
            };

            var response = await _api.Membership.Users.Send(request);

            var inserted = await _api.Membership.Users.Send(new UserGet.Request() { Id = response.Id });

            _state.Id = response.Id;

            _state.Inserting = request;

            _state.Inserted = inserted;
        }

        [When(@"the user is updated")]
        public async Task WhenTheUserIsUpdated()
        {
            var fakerUser = new FakerContext().Membership.User.Generate();

            var request = new UserUpdate.Request()
            {
                Id = _state.Inserted.Id,
                TenantId = _state.Inserted.TenantId,
                Username = fakerUser.Username,
                Person = fakerUser.Person,
                HomeAddress = fakerUser.HomeAddress,
                RoleIds = new List<string>(),
                BranchIds = new List<string>()
            };

            await _api.Membership.Users.Send(request);

            var updated = await _api.Membership.Users.Send(new UserGet.Request() { Id = _state.Inserted.Id });

            _state.Updating = request;

            _state.Updated = updated;
        }

        [Then(@"the user reflects the changes")]
        public void ThenTheUserReflectsTheChanges()
        {
            Assert.AreEqual(_env.Tenant.Id, _state.Inserted.TenantId);
            Assert.AreEqual(_state.Inserting.Username, _state.Inserted.Username);
            Assert.AreEqual(_state.Inserting.Person, _state.Inserted.Person);
            Assert.AreEqual(_state.Inserting.HomeAddress, _state.Inserted.HomeAddress);
            CollectionAssert.AreEquivalent(_state.Inserting.RoleIds, _state.Inserted.RoleIds);
            CollectionAssert.AreEquivalent(_state.Inserting.BranchIds, _state.Inserted.BranchIds);

            Assert.AreEqual(_state.Updating.Username, _state.Updated.Username);
            Assert.AreEqual(_state.Updating.Person, _state.Updated.Person);
            Assert.AreEqual(_state.Updating.HomeAddress, _state.Updated.HomeAddress);
            CollectionAssert.AreEquivalent(_state.Updating.RoleIds, _state.Updated.RoleIds);
            CollectionAssert.AreEquivalent(_state.Updating.BranchIds, _state.Updated.BranchIds);

            Assert.AreNotEqual(_state.Updated.Username, _state.Inserted.Username);
            Assert.AreNotEqual(_state.Updated.Person, _state.Inserted.Person);
            Assert.AreNotEqual(_state.Updated.HomeAddress, _state.Inserted.HomeAddress);
            CollectionAssert.AreNotEquivalent(_state.Updated.RoleIds, _state.Inserted.RoleIds);
            CollectionAssert.AreNotEquivalent(_state.Updated.BranchIds, _state.Inserted.BranchIds);
        }

        [Then(@"the user is deletable")]
        public void ThenTheUserIsDeletable()
        {
            Assert.DoesNotThrowAsync(async () => await _api.Membership.Users.Send(new UserDelete.Request() { Id = _state.Id }));
        }
    }
}
