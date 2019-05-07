using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Messages;

namespace AMMS.Domain.Membership.Messages.Tenants
{
    public class TenantGet
    {
        public class Request : WithStringId, IRequest<Response> { }

        public class Response : Dtos.Tenant { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Tenant, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Models.Tenant, Response>();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationtoken)
            {
                var branch = await Db.Membership.Tenants.AsQueryable()
                    .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationtoken);

                return Mapper.Map<Response>(branch);
            }
        }
    }
}