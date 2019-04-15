using AMMS.Domain.Users.Messages;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers
{
    [Route("users")]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator) => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<GetMessage.Response> Handle([FromRoute]GetMessage.Request request)
        {
            return _mediator.Send(request ?? new GetMessage.Request());
        }

        [HttpGet()]
        public Task<FindMessage.Response> Handle([FromQuery]FindMessage.Request request)
        {
            return _mediator.Send(request ?? new FindMessage.Request());
        }

        [HttpPost()]
        public Task<CreateMessage.Response> Handle([FromBody]CreateMessage.Request request)
        {
            return _mediator.Send(request ?? new CreateMessage.Request());
        }

        [HttpPut()]
        public Task<UpdateMessage.Response> Handle([FromBody]UpdateMessage.Request request)
        {
            return _mediator.Send(request ?? new UpdateMessage.Request());
        }

        [HttpDelete("{request.id}")]
        public Task<DeleteMessage.Response> Handle([FromRoute]DeleteMessage.Request request)
        {
            return _mediator.Send(request ?? new DeleteMessage.Request());
        }
    }
}