using AMMS.Domain.Membership.Messages.Users;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership
{
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator) => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<UserGet.Response> Handle([FromRoute]UserGet.Request request)
        {
            return _mediator.Send(request ?? new UserGet.Request());
        }

        [HttpGet()]
        public Task<UserFind.Response> Handle([FromQuery]UserFind.Request request)
        {
            return _mediator.Send(request ?? new UserFind.Request());
        }

        [HttpPost()]
        public Task<UserCreate.Response> Handle([FromBody]UserCreate.Request request)
        {
            return _mediator.Send(request ?? new UserCreate.Request());
        }

        [HttpPut("{request.id}")]
        public Task<UserUpdate.Response> Handle([FromBody]UserUpdate.Request request)
        {
            return _mediator.Send(request ?? new UserUpdate.Request());
        }

        [HttpDelete("{request.id}")]
        public Task<UserDelete.Response> Handle([FromRoute]UserDelete.Request request)
        {
            return _mediator.Send(request ?? new UserDelete.Request());
        }

        [HttpPost("~/login")]
        public Task<UserLogin.Response> Handle([FromBody]UserLogin.Request request)
        {
            return _mediator.Send(request ?? new UserLogin.Request());
        }

    }
}