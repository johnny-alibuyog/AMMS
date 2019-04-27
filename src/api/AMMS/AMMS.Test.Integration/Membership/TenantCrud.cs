using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Service.Client;
using NUnit.Framework;
using System.Threading.Tasks;
using TechTalk.SpecFlow;

namespace AMMS.Test.Integration.Membership
{
    [Binding]
    public class TenantCrud
    {
        private readonly Context _ctx = new Context();

        [Given(@"a tenant has been created")]
        public async Task GivenATenantHasBeenCreated()
        {
            var request = new TenantCreate.Request()
            {
                Code = "some_code",
                Name = "Some Tenant"
            };

            var response = await _ctx.Api.Tenants.Send(request);

            var inserted = await _ctx.Api.Tenants.Send(new TenantGet.Request() { Id = response.Id });

            _ctx.CaptureInsertingState(request);

            _ctx.CaptureInsertedState(inserted);
        }

        [When(@"the tenant is updated")]
        public async Task GivenTheTenantIsUpdated()
        {
            var request = new TenantUpdate.Request()
            {
                Id = _ctx.InsertedState.Id,
                Code = _ctx.InsertedState.Code + "_Updated",
                Name = _ctx.InsertedState.Name + "_Updated"
            };

            await _ctx.Api.Tenants.Send(request);

            var updated = await _ctx.Api.Tenants.Send(new TenantGet.Request() { Id = _ctx.InsertedState.Id });

            _ctx.CaptureUpdatingState(request);

            _ctx.CaptureUpdatedState(updated);
        }

        [Then(@"the tenant reflects the changes")]
        public void ThenTheTenantReflectsTheChanges()
        {
            Assert.AreEqual(_ctx.InsertingState.Code, _ctx.InsertedState.Code);
            Assert.AreEqual(_ctx.InsertingState.Name, _ctx.InsertedState.Name);
            Assert.AreEqual(_ctx.UpdatingState.Code, _ctx.UpdatedState.Code);
            Assert.AreEqual(_ctx.UpdatingState.Name, _ctx.UpdatedState.Name);
            Assert.AreNotEqual(_ctx.UpdatedState.Code, _ctx.InsertedState.Code);
            Assert.AreNotEqual(_ctx.UpdatedState.Name, _ctx.InsertedState.Name);
        }

        [Then(@"the tenant is deletable")]
        public void ThenTheTenantIsDeletable()
        {
            Assert.DoesNotThrowAsync(async () => await _ctx.Api.Tenants.Send(new TenantDelete.Request() { Id = _ctx.TenantId }));
        }

        private class Context
        {
            public Api Api { get; } = ApiProvider.CreateApi();

            public string TenantId { get; private set; }

            public Tenant InsertingState { get; private set; }

            public Tenant InsertedState { get; private set; }

            public Tenant UpdatingState { get; private set; }

            public Tenant UpdatedState { get; private set; }

            public void CaptureInsertingState(TenantCreate.Request state) => InsertingState = state;

            public void CaptureInsertedState(TenantGet.Response state) => TenantId = (InsertedState = state).Id;

            public void CaptureUpdatingState(TenantUpdate.Request state) => UpdatingState = state;

            public void CaptureUpdatedState(TenantGet.Response state) => UpdatedState = state;
        }
    }
}
