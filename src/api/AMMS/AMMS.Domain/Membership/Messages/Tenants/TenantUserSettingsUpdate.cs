using AMMS.Domain.Common.Messages;
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
    public class TenantUserSettingsUpdate
    {
        public class Request : Dtos.TenantUserSettings, IRequest<Response> { }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.TenantUserSettings, Access.Update));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Request, Models.TenantUserSettings>().ReverseMap();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var settings = Mapper.Map<TenantUserSettings>(request);

                settings.SetTenant(Context.TenantId);

                var exists = await Db.Common.Settings.OfType<TenantUserSettings>()
                    .AsQueryable().AnyAsync(x => x.TenantId == settings.TenantId);

                if (exists)
                {
                    await Db.Common.Settings.OfType<TenantUserSettings>().UpdateOneAsync(
                        filter: x => x.TenantId == settings.TenantId, 
                        update: Builders<TenantUserSettings>.Update.Set(x => x.DefaultPassword, settings.DefaultPassword),
                        options: new UpdateOptions(), 
                        cancellationToken: cancellationToken
                    );
                }
                else
                {
                    await Db.Common.Settings.InsertOneAsync(settings, new InsertOneOptions(), cancellationToken);
                }

                return new Response();
            }
        }
    }
}
