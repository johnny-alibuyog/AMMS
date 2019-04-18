using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Serilog;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;

namespace AMMS.Domain.Membership.Messages.Users
{
    public class CreateMessage
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

                //var settings = _db.CommonContext.Settings.AsQueryable()
                //    .OfType<UserSettings>()
                //    .FirstOrDefaultAsync(x => x.TenantId == )

                user.SetPassword(new HashProvider(), "sample");

                await Db.Membership.Users.InsertOneAsync(user);

                return Mapper.Map<Response>(user);
            }
        }
    }
}