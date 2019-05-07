using AMMS.Domain.Membership.Messages.Tenants;
using AMMS.Service.Host.Common.Client;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership
{
    [Route("tenants")]
    public class TenantController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TenantController(IMediator mediator) 
            => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<TenantGet.Response> Handle([FromRoute]TenantGet.Request request)
            => _mediator.Send(request ?? new TenantGet.Request());

        [HttpGet()]
        public Task<TenantFind.Response> Handle([FromQuery]TenantFind.Request request)
            => _mediator.Send(request ?? new TenantFind.Request());

        [HttpPost()]
        public Task<TenantCreate.Response> Handle([FromBody]TenantCreate.Request request)
            => _mediator.Send(request ?? new TenantCreate.Request());

        [HttpPut("{request.id}")]
        public Task<TenantUpdate.Response> Handle([FromBody]TenantUpdate.Request request)
            => _mediator.Send(request ?? new TenantUpdate.Request());

        [HttpDelete("{request.id}")]
        public Task<TenantDelete.Response> Handle([FromRoute]TenantDelete.Request request)
            => _mediator.Send(request ?? new TenantDelete.Request());

        [HttpPost("environments")]
        public Task<TenantEnvironmentCreate.Response> Handle([FromBody]TenantEnvironmentCreate.Request request)
            => _mediator.Send(request ?? new TenantEnvironmentCreate.Request());

        [HttpDelete("environments/{request.tenantId}")]
        public Task<TenantEnvironmentDelete.Response> Handle([FromRoute]TenantEnvironmentDelete.Request request)
            => _mediator.Send(request ?? new TenantEnvironmentDelete.Request());

        [HttpGet("{request.tenantId}/user-settings")]
        public Task<TenantUserSettingsGet.Response> Handle([FromRoute]TenantUserSettingsGet.Request request)
            => _mediator.Send(request ?? new TenantUserSettingsGet.Request());

        [HttpPut("{request.tenantId}/user-settings")]
        public Task<TenantUserSettingsUpdate.Response> Handle([FromBody]TenantUserSettingsUpdate.Request request)
            => _mediator.Send(request ?? new TenantUserSettingsUpdate.Request());
    }

    public class TenantClient
    {
        private readonly string _resource = "tenants";
        private readonly RestClientFacade _restClient;

        public TenantClient(RestClientFacade restClient)
            => _restClient = restClient;

        public Task<TenantGet.Response> Send(TenantGet.Request request)
            => _restClient.Get($"{_resource}/{request.Id}", request);

        public Task<TenantCreate.Response> Send(TenantCreate.Request request)
            => _restClient.Post($"{_resource}", request);

        public Task<TenantUpdate.Response> Send(TenantUpdate.Request request)
            => _restClient.Put($"{_resource}/{request.Id}", request);

        public Task<TenantDelete.Response> Send(TenantDelete.Request request)
            => _restClient.Delete($"{_resource}/{request.Id}", request);

        public Task<TenantEnvironmentCreate.Response> Send(TenantEnvironmentCreate.Request request)
            => _restClient.Post($"{_resource}/environments", request);

        public Task<TenantEnvironmentDelete.Response> Send(TenantEnvironmentDelete.Request request)
            => _restClient.Delete($"{_resource}/environments/{request.TenantId}", request);

        public Task<TenantUserSettingsGet.Response> Send(TenantUserSettingsGet.Request request)
            => _restClient.Get($"{_resource}/{request.TenantId}/user-settings/", request);

        public Task<TenantUserSettingsUpdate.Response> Send(TenantUserSettingsUpdate.Request request)
            => _restClient.Post($"{_resource}/{request.TenantId}/user-settings", request);
    }
}
