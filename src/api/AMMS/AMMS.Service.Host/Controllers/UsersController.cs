using AMMS.Domain.Users.Messages;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers
{
    [Route("users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UsersController(IMediator mediator) => this._mediator = mediator;

        [HttpGet()]
        [Route("{request.id}")]
        public Task<GetMessage.Response> Handle([FromRoute]GetMessage.Request request) 
        {
            return this._mediator.Send(request ?? new GetMessage.Request());
        }

        [HttpGet()]
        [Route("")]
        public Task<FindMessage.Response> Handle([FromQuery]FindMessage.Request request)
        {
            return this._mediator.Send(request ?? new FindMessage.Request());
        }

        [HttpPost()]
        [Route("")]
        public Task<CreateMessage.Response> Handle([FromBody]CreateMessage.Request request)
        {
            return this._mediator.Send(request ?? new CreateMessage.Request());
        }
    }

}