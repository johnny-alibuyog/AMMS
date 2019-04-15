using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Users.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using Serilog;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class UpdateMessage
    {
        public class Request : Dtos.User, IRequest<Response> { }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Models.Permission.To(Area.Users, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Request, Models.User>();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(DbContext db, ILogger log, IMapper mapper) : base(db, log, mapper) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var entity = _mapper.Map<Models.User>(request);

                await _db.UserContext.Users.ReplaceOneAsync(x => x.Id == entity.Id, entity);

                return new Response();
            }
        }
    }
}
