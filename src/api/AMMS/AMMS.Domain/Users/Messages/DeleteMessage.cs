using AMMS.Domain.Common.Messages;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class DeleteMessage
    {
        public class Request : WithStringId, IRequest<Response> { }

        public class Response { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly DbContext _db;

            public Handler(DbContext db) => this._db = db;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                await this._db.UserContext.Users.DeleteOneAsync(x => x.Id == request.Id);

                return new Response();
            }
        }
    }
}
