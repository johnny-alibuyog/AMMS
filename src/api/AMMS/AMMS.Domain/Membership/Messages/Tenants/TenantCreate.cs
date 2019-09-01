using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Tenants
{
    public class TenantCreate
    {
        public class Request : Dtos.Tenant, IRequest<Response> { }

        public class Response : WithStringId { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Tenant, Access.Create));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile()
            {
                CreateMap<Models.Tenant, Response>().ReverseMap();

                CreateMap<Models.Tenant, Request>().ReverseMap();
            }
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var tenant = Mapper.Map<Tenant>(request);

                await Db.Membership.Tenants.InsertOneAsync(tenant, new InsertOneOptions(), cancellationToken);

                return Mapper.Map<Response>(tenant);
            }
        }
    }
}
