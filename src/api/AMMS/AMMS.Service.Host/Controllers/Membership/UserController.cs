using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Host.Common.Client;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership
{
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UserController(IMediator mediator) 
            => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<UserGet.Response> Handle([FromRoute]UserGet.Request request)
            => _mediator.Send(request ?? new UserGet.Request());

        [HttpGet()]
        public Task<UserFind.Response> Handle([FromQuery]UserFind.Request request)
            => _mediator.Send(request ?? new UserFind.Request());

        [HttpPost()]
        public Task<UserCreate.Response> Handle([FromBody]UserCreate.Request request)
            => _mediator.Send(request ?? new UserCreate.Request());

        [HttpPut("{request.id}")]
        public Task<UserUpdate.Response> Handle([FromBody]UserUpdate.Request request)
            => _mediator.Send(request ?? new UserUpdate.Request());

        [HttpDelete("{request.id}")]
        public Task<UserDelete.Response> Handle([FromRoute]UserDelete.Request request)
            => _mediator.Send(request ?? new UserDelete.Request());

        [HttpPost("~/login")]
        public Task<UserLogin.Response> Handle([FromBody]UserLogin.Request request)
            => _mediator.Send(request ?? new UserLogin.Request());
    }

    public class UserClient
    {
        private readonly string _resource = "users";
        private readonly RestClientFacade _restClient;

        public UserClient(RestClientFacade restClient)
            => _restClient = restClient;

        public Task<UserGet.Response> Send(UserGet.Request request)
            => _restClient.Get($"{_resource}/{request.Id}", request);

        public Task<UserCreate.Response> Send(UserCreate.Request request)
            => _restClient.Post($"{_resource}", request);

        public Task<UserUpdate.Response> Send(UserUpdate.Request request)
            => _restClient.Put($"{_resource}/{request.Id}", request);

        public Task<UserDelete.Response> Send(UserDelete.Request request)
            => _restClient.Delete($"{_resource}/{request.Id}", request);

        public Task<UserLogin.Response> Send(UserLogin.Request request)
            => _restClient.Post($"login", request);

        public Task<UserChangePassword.Response> Send(UserChangePassword.Request request)
            => _restClient.Post($"changePassword", request);
    }
}