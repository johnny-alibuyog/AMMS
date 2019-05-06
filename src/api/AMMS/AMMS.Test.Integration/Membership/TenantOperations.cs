using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Service.Client;
using AMMS.Test.Integration.Utils;
using NUnit.Framework;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Membership
{
    [Binding]
    public class TenantOperations
    {
        private readonly Api _api;

        private readonly CrudStateContainer<string, Tenant> _state;

        public TenantOperations(ScenarioContext scenarioContext)
        {
            _api = ApiProvider.CreateApi();
            _state = new CrudStateContainer<string, Tenant>(scenarioContext);
        }

        [Given(@"a tenant has been created")]
        public async Task GivenATenantHasBeenCreated()
        {
            var request = new TenantCreate.Request()
            {
                Code = "some_code",
                Name = "Some Tenant"
            };

            var response = await _api.Membership.Tenants.Send(request);

            var inserted = await _api.Membership.Tenants.Send(new TenantGet.Request() { Id = response.Id });

            _state.Id = response.Id;

            _state.Inserting = request;

            _state.Inserted = inserted;
        }

        [When(@"the tenant is updated")]
        public async Task GivenTheTenantIsUpdated()
        {
            var request = new TenantUpdate.Request()
            {
                Id = _state.Inserted.Id,
                Code = _state.Inserted.Code + "_Updated",
                Name = _state.Inserted.Name + "_Updated"
            };

            await _api.Membership.Tenants.Send(request);

            var updated = await _api.Membership.Tenants.Send(new TenantGet.Request() { Id = _state.Inserted.Id });

            _state.Updating = request;

            _state.Updated = updated;
        }

        [Then(@"the tenant reflects the changes")]
        public void ThenTheTenantReflectsTheChanges()
        {
            Assert.AreEqual(_state.Inserting.Code, _state.Inserted.Code);
            Assert.AreEqual(_state.Inserting.Name, _state.Inserted.Name);
            Assert.AreEqual(_state.Updating.Code, _state.Updated.Code);
            Assert.AreEqual(_state.Updating.Name, _state.Updated.Name);
            Assert.AreNotEqual(_state.Updated.Code, _state.Inserted.Code);
            Assert.AreNotEqual(_state.Updated.Name, _state.Inserted.Name);
        }

        [Then(@"the tenant is deletable")]
        public void ThenTheTenantIsDeletable()
        {
            Assert.DoesNotThrowAsync(async () => await _api.Membership.Tenants.Send(new TenantDelete.Request() { Id = _state.Id }));
        }
    }
}
