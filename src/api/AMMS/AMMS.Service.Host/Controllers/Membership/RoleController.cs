using AMMS.Domain.Membership.Messages.Roles;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership
{
    [Route("roles")]
    public class RoleController
    {
        private readonly IMediator _mediator;

        public RoleController(IMediator mediator) => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<RoleGet.Response> Handle([FromRoute]RoleGet.Request request)
        {
            return _mediator.Send(request ?? new RoleGet.Request());
        }

        [HttpGet()]
        public Task<RoleFind.Response> Handle([FromQuery]RoleFind.Request request)
        {
            return _mediator.Send(request ?? new RoleFind.Request());
        }

        [HttpPost()]
        public Task<RoleCreate.Response> Handle([FromBody]RoleCreate.Request request)
        {
            return _mediator.Send(request ?? new RoleCreate.Request());
        }

        [HttpPut("{request.id}")]
        public Task<RoleUpdate.Response> Handle([FromBody]RoleUpdate.Request request)
        {
            return _mediator.Send(request ?? new RoleUpdate.Request());
        }

        [HttpDelete("{request.id}")]
        public Task<RoleDelete.Response> Handle([FromRoute]RoleDelete.Request request)
        {
            return _mediator.Send(request ?? new RoleDelete.Request());
        }
    }
}
