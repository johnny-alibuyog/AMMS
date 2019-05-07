using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Roles
{
    public class RoleUpdate
    {
        public class Request : Dtos.Role, IRequest<Response> { }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Role, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Request, Models.Role>();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var role = Mapper.Map<Models.Role>(request);

                role.SetTenant(Context.TenantId);

                await Db.Membership.Roles.ReplaceOneAsync(x => x.Id == role.Id, role, new UpdateOptions(), cancellationToken);

                return new Response();
            }
        }
    }
}
