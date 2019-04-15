using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
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
    public class DeleteMessage
    {
        public class Request : WithStringId, IRequest<Response> { }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Models.Permission.To(Area.Users, Access.Delete));
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(DbContext db, ILogger log, IMapper mapper) : base(db, log, mapper) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                await _db.UserContext.Users.DeleteOneAsync(x => x.Id == request.Id);

                return new Response();
            }
        }
    }
}
