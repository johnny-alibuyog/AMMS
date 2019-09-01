using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Roles
{
    public class RoleCreate
    {
        public class Request : Dtos.Role, IRequest<Response> { }

        public class Response : WithStringId { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Role, Access.Create));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile()
            {
                CreateMap<Models.Role, Response>().ReverseMap();

                CreateMap<Models.Role, Request>().ReverseMap();
            }
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var role = Mapper.Map<Role>(request);

                role.SetTenant(Context.TenantId);

                await Db.Membership.Roles.InsertOneAsync(role, new InsertOneOptions(), cancellationToken);

                return Mapper.Map<Response>(role);
            }
        }
    }
}
