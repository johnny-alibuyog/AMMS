using AMMS.Domain.Membership.Messages.Roles;
using AMMS.Service.Host.Common.Client;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Controllers.Membership;

[Route("roles")]
public class RoleController
{
    private readonly IMediator _mediator;

    public RoleController(IMediator mediator) 
        => this._mediator = mediator;

    [HttpGet("{request.id}")]
    public Task<RoleGet.Response> Handle([FromRoute]RoleGet.Request request)
        => _mediator.Send(request ?? new RoleGet.Request());

    [HttpGet()]
    public Task<RoleFind.Response> Handle([FromQuery]RoleFind.Request request)
        => _mediator.Send(request ?? new RoleFind.Request());

    [HttpPost()]
    public Task<RoleCreate.Response> Handle([FromBody]RoleCreate.Request request)
        => _mediator.Send(request ?? new RoleCreate.Request());

    [HttpPut("{request.id}")]
    public Task<RoleUpdate.Response> Handle([FromBody]RoleUpdate.Request request)
        => _mediator.Send(request ?? new RoleUpdate.Request());

    [HttpDelete("{request.id}")]
    public Task<RoleDelete.Response> Handle([FromRoute]RoleDelete.Request request)
        => _mediator.Send(request ?? new RoleDelete.Request());
}

public class RoleClient
{
    private readonly string _resource = "roles";
    private readonly RestClientFacade _restClient;

    public RoleClient(RestClientFacade restClient)
        => _restClient = restClient;

    public Task<RoleGet.Response> Send(RoleGet.Request request)
        => _restClient.Get($"{_resource}/{request.Id}", request);

    public Task<RoleCreate.Response> Send(RoleCreate.Request request)
        => _restClient.Post($"{_resource}", request);

    public Task<RoleUpdate.Response> Send(RoleUpdate.Request request)
        => _restClient.Put($"{_resource}/{request.Id}", request);

    public Task<RoleDelete.Response> Send(RoleDelete.Request request)
        => _restClient.Delete($"{_resource}/{request.Id}", request);
}
