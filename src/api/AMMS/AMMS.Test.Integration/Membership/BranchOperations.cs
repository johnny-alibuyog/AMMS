using AMMS.Domain.Membership.Messages.Branches;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Service.Host.Common.Client;
using AMMS.Test.Integration.Utils;
using NUnit.Framework;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Membership
{
    [Binding]
    public class BranchOperations
    {
        private ClientApi _api;

        private readonly CrudStateContainer<string, Branch> _state;

        private DummyEnvironment _env;

        public BranchOperations(ScenarioContext scenarioContext)
        {
            _state = new CrudStateContainer<string, Branch>(scenarioContext);
        }

        [Before("BranchCrud")]
        public async Task Before()
        {
            _env = new DummyEnvironment();

            await _env.Initialize();

            _api = ClientApiProvider.CreateClientApi(_env);
        }

        [After("BranchCrud")]
        public async Task After()
        {
            await _env.Clean();
        }

        [Given(@"a branch has been created")]
        public async Task GivenABranchHasBeenCreated()
        {
            var request = new BranchCreate.Request()
            {
                Code = "some_code",
                Name = "Some Branch"
            };

            var response = await _api.Membership.Branches.Send(request);

            var inserted = await _api.Membership.Branches.Send(new BranchGet.Request() { Id = response.Id });

            _state.Id = response.Id;

            _state.Inserting = request;

            _state.Inserted = inserted;
        }

        [When(@"the branch is updated")]
        public async Task WhenTheBranchIsUpdated()
        {
            var request = new BranchUpdate.Request()
            {
                Id = _state.Inserted.Id,
                Code = _state.Inserted.Code + "_Updated",
                Name = _state.Inserted.Name + "_Updated"
            };

            await _api.Membership.Branches.Send(request);

            var updated = await _api.Membership.Branches.Send(new BranchGet.Request() { Id = _state.Inserted.Id });

            _state.Updating = request;

            _state.Updated = updated;
        }

        [Then(@"the branch reflects the changes")]
        public void ThenTheBranchReflectsTheChanges()
        {
            Assert.AreEqual(_env.Tenant.Id, _state.Inserted.TenantId);
            Assert.AreEqual(_state.Inserting.Code, _state.Inserted.Code);
            Assert.AreEqual(_state.Inserting.Name, _state.Inserted.Name);
            Assert.AreEqual(_state.Updating.Code, _state.Updated.Code);
            Assert.AreEqual(_state.Updating.Name, _state.Updated.Name);
            Assert.AreNotEqual(_state.Updated.Code, _state.Inserted.Code);
            Assert.AreNotEqual(_state.Updated.Name, _state.Inserted.Name);
        }

        [Then(@"the branch is deletable")]
        public void ThenTheBranchIsDeletable()
        {
            Assert.DoesNotThrowAsync(async () => await _api.Membership.Branches.Send(new BranchDelete.Request() { Id = _state.Id }));
        }
    }
}
