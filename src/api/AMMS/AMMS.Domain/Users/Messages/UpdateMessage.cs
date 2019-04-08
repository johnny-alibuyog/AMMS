using AMMS.Domain.Utils.Extentions;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class UpdateMessage
    {
        public class Request : Models.User, IRequest<Response> { }

        public class Response { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly DbContext _db;

            public Handler(DbContext db) => this._db = db;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var entity = request.MapTo(default(Entities.User));

                await this._db.UserContext.Users.ReplaceOneAsync(x => x.Id == entity.Id, entity);

                return new Response();
            }
        }
    }
}
