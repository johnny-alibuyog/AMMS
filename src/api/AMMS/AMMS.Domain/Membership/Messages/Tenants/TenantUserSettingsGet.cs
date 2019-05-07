using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Tenants
{
    public class TenantUserSettingsGet
    {
        public class Request : IRequest<Response>
        {
            public string TenantId { get; set; }
        }

        public class Response : Dtos.TenantUserSettings { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.TenantUserSettings, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Models.TenantUserSettings, Response>();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationtoken)
            {
                var settings = await Db.Common.Settings.OfType<TenantUserSettings>().AsQueryable()
                    .FirstOrDefaultAsync(x => x.TenantId == request.TenantId, cancellationtoken);

                if (settings == null)
                {
                    settings = new TenantUserSettings(Context.TenantId, "temp@123");
                }

                return Mapper.Map<Response>(settings);
            }
        }
    }
}
