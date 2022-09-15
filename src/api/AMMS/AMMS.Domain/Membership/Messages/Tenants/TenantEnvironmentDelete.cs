using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using FluentValidation;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Tenants;

public class TenantEnvironmentDelete
{
    public class Request : IRequest<Response>
    {
        public string TenantId { get; set; }
    }

    public class Response { }

    public class Validator : AbstractValidator<Request>
    {
        public Validator()
        {
            RuleFor(x => x.TenantId).NotNull().NotEmpty();
        }
    }

    public class Auth : AccessControl<Request>
    {
        public Auth() => With(Permission.To(Area.All, Access.Super));
    }

    public class Handler : AbstractRequestHandler<Request, Response>
    {
        public Handler(IHandlerDependencyHolder holder) : base(holder) { }

        public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            await Db.Membership.Branches.DeleteManyAsync(x => x.TenantId == request.TenantId, new DeleteOptions(), cancellationToken);

            await Db.Membership.Roles.DeleteManyAsync(x => x.TenantId == request.TenantId, new DeleteOptions(), cancellationToken);

            await Db.Common.Settings.DeleteManyAsync(x => x.TenantId == request.TenantId, new DeleteOptions(), cancellationToken);

            await Db.Membership.Users.DeleteManyAsync(x => x.TenantId == request.TenantId, new DeleteOptions(), cancellationToken);

            await Db.Membership.Tenants.DeleteOneAsync(x => x.Id == request.TenantId, new DeleteOptions(), cancellationToken);

            return new Response();
        }
    }
}
