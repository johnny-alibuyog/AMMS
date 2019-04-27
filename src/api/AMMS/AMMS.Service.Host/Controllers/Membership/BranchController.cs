using AMMS.Domain.Membership.Messages.Branches;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership
{
    [Route("branches")]
    public class BranchController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BranchController(IMediator mediator) => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<BranchGet.Response> Handle([FromRoute]BranchGet.Request request)
        {
            return _mediator.Send(request ?? new BranchGet.Request());
        }

        [HttpGet()]
        public Task<BranchFind.Response> Handle([FromQuery]BranchFind.Request request)
        {
            return _mediator.Send(request ?? new BranchFind.Request());
        }

        [HttpPost()]
        public Task<BranchCreate.Response> Handle([FromBody]BranchCreate.Request request)
        {
            return _mediator.Send(request ?? new BranchCreate.Request());
        }

        [HttpPut("{request.id}")]
        public Task<BranchUpdate.Response> Handle([FromBody]BranchUpdate.Request request)
        {
            return _mediator.Send(request ?? new BranchUpdate.Request());
        }

        [HttpDelete("{request.id}")]
        public Task<BranchDelete.Response> Handle([FromRoute]BranchDelete.Request request)
        {
            return _mediator.Send(request ?? new BranchDelete.Request());
        }
    }
}
