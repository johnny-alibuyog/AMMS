using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Users
{
    public class UserCreate
    {
        public class Request : Dtos.User, IRequest<Response> { }

        public class Response : WithStringId { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.User, Access.Create));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile()
            {
                CreateMap<Models.User, Response>();
                CreateMap<Models.User, Request>();
            }
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = Mapper.Map<User>(request);

                var settings = await Db.Common.Settings.AsQueryable().OfType<UserSettings>()
                    .FirstOrDefaultAsync(x => x.TenantId == Context.TenantId, cancellationToken);

                user.SetPassword(new HashProvider(), settings.DefaultPassword);

                await Db.Membership.Users.InsertOneAsync(user);

                return Mapper.Map<Response>(user);
            }
        }
    }
}