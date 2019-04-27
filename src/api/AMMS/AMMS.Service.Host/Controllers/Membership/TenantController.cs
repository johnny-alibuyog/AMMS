using AMMS.Domain.Membership.Messages.Tenants;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership
{
    [Route("tenants")]
    public class TenantController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TenantController(IMediator mediator) => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<TenantGet.Response> Handle([FromRoute]TenantGet.Request request)
        {
            return _mediator.Send(request ?? new TenantGet.Request());
        }

        [HttpGet()]
        public Task<TenantFind.Response> Handle([FromQuery]TenantFind.Request request)
        {
            return _mediator.Send(request ?? new TenantFind.Request());
        }

        [HttpPost()]
        public async Task<ActionResult<TenantCreate.Response>> Handle([FromBody]TenantCreate.Request request)
        {
            return await _mediator.Send(request ?? new TenantCreate.Request());
        }

        [HttpPut("{request.id}")]
        public Task<TenantUpdate.Response> Handle([FromBody]TenantUpdate.Request request)
        {
            return _mediator.Send(request ?? new TenantUpdate.Request());
        }

        [HttpDelete("{request.id}")]
        public Task<TenantDelete.Response> Handle([FromRoute]TenantDelete.Request request)
        {
            return _mediator.Send(request ?? new TenantDelete.Request());
        }
    }
}
