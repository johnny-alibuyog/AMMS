using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Service.Host.Common.Client;
using AMMS.Test.Integration.Utils;
using NUnit.Framework;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Membership
{
    [Binding]
    public class TenantUserSettingsOperations
    {
        private DummyEnvironment _env;

        private ClientApi _api;

        private readonly CrudStateContainer<string, TenantUserSettings> _state;

        public TenantUserSettingsOperations(ScenarioContext scenarioContext)
        {
            _state = new CrudStateContainer<string, TenantUserSettings>(scenarioContext);
        }

        [Before("TenantUserSettingsReadAndUpdate")]
        public async Task Before()
        {
            _env = new DummyEnvironment();

            await _env.Initialize();

            _api = ApiProvider.CreateApi(_env);
        }

        [After("TenantUserSettingsReadAndUpdate")]
        public async Task After()
        {
            await _env.Clean();
        }

        [When(@"tenant user settings is updated")]
        public async Task WhenTenantUserSettingsIsUpdated()
        {
            var request = new TenantUserSettingsUpdate.Request()
            {
                DefaultPassword = "DefaultPassword_Updated"
            };

            await _api.Membership.Tenants.Send(request);

            var updated = await _api.Membership.Tenants.Send(new TenantUserSettingsGet.Request() { TenantId = _env.Tenant.Id });

            _state.Updating = request;

            _state.Updated = updated;
        }

        [Then(@"tenant user settings reflects the changes")]
        public void ThenTenantUserSettingsReflectsTheChanges()
        {
            Assert.AreEqual(_env.Tenant.Id, _state.Updated.TenantId);
            Assert.AreEqual(_state.Updating.DefaultPassword, _state.Updated.DefaultPassword);
        }
    }
}
