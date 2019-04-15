using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Users.Models;
using AutoMapper;
using MediatR;
using Serilog;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class CreateMessage
    {
        public class Request : Dtos.User, IRequest<Response> { }

        public class Response : WithStringId { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Users, Access.Create));
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
            public Handler(DbContext db, ILogger log, IMapper mapper) : base(db, log, mapper) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var entity = _mapper.Map<User>(request);

                await this._db.UserContext.Users.InsertOneAsync(entity);

                return _mapper.Map<Response>(entity);
            }
        }
    }
}