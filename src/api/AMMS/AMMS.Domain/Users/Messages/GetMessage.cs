using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Users.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Serilog;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class GetMessage
    {
        public class Request : WithStringId, IRequest<Response> { }

        public class Response : Dtos.User { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Models.Permission.To(Area.Users, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Models.User, Response>();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(DbContext db, ILogger log, IMapper mapper) : base(db, log, mapper) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationtoken)
            {
                var user = await this._db.UserContext.Users.AsQueryable()
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                return _mapper.Map<Response>(user);
            }
        }
    }
}