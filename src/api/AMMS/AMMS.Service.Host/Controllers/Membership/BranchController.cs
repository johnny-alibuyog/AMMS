using AMMS.Domain.Membership.Messages.Branches;
using AMMS.Service.Host.Common.Client;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership
{
    [Route("branches")]
    public class BranchController : ControllerBase
    {
        private readonly IMediator _mediator;

        public BranchController(IMediator mediator)
            => this._mediator = mediator;

        [HttpGet("{request.id}")]
        public Task<BranchGet.Response> Handle([FromRoute]BranchGet.Request request)
            => _mediator.Send(request ?? new BranchGet.Request());

        [HttpGet()]
        public Task<BranchFind.Response> Handle([FromQuery]BranchFind.Request request)
            => _mediator.Send(request ?? new BranchFind.Request());

        [HttpPost()]
        public Task<BranchCreate.Response> Handle([FromBody]BranchCreate.Request request)
            => _mediator.Send(request ?? new BranchCreate.Request());

        [HttpPut("{request.id}")]
        public Task<BranchUpdate.Response> Handle([FromBody]BranchUpdate.Request request)
            => _mediator.Send(request ?? new BranchUpdate.Request());

        [HttpDelete("{request.id}")]
        public Task<BranchDelete.Response> Handle([FromRoute]BranchDelete.Request request)
            => _mediator.Send(request ?? new BranchDelete.Request());
    }

    public class BranchClient
    {
        private readonly string _resource = "branches";
        private readonly RestClientFacade _restClient;

        public BranchClient(RestClientFacade restClient)
            => _restClient = restClient;

        public Task<BranchGet.Response> Send(BranchGet.Request request)
            => _restClient.Get($"{_resource}/{request.Id}", request);

        public Task<BranchCreate.Response> Send(BranchCreate.Request request)
            => _restClient.Post($"{_resource}", request);

        public Task<BranchUpdate.Response> Send(BranchUpdate.Request request)
            => _restClient.Put($"{_resource}/{request.Id}", request);

        public Task<BranchDelete.Response> Send(BranchDelete.Request request)
            => _restClient.Delete($"{_resource}/{request.Id}", request);
    }
}
