using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Roles
{
    public class RoleFind
    {
        public class Request : IRequest<Response> { }

        public class Response : List<Dtos.Role> { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Role, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Lookup<string>, Response>().ReverseMap();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var roles = await Db.Membership.Roles.AsQueryable()
                    .Where(x => x.TenantId == Context.TenantId)
                    .ToListAsync(cancellationToken);

                return Mapper.Map<Response>(roles);
            }
        }
    }
}
