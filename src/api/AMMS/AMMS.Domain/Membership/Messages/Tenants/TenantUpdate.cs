using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Tenants
{
    public class TenantUpdate
    {
        public class Request : Dtos.Tenant, IRequest<Response> { }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Tenant, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Request, Models.Tenant>().ReverseMap();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var tenant = Mapper.Map<Tenant>(request);

                await Db.Membership.Tenants.ReplaceOneAsync(x => x.Id == tenant.Id, tenant, new ReplaceOptions(), cancellationToken);

                return new Response();
            }
        }
    }
}
