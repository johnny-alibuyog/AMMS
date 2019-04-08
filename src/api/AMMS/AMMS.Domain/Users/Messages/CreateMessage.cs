using AMMS.Domain.Common.Messages;
using AMMS.Domain.Utils.Extentions;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class CreateMessage
    {
        public class Request : Models.User, IRequest<Response> { }

        public class Response : WithStringId { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly DbContext _db;

            public Handler(DbContext db) => this._db = db;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var entity = request.MapTo(default(Entities.User));

                await this._db.UserContext.Users.InsertOneAsync(entity);

                return new Response() { Id = entity.Id };
            }
        }
    }
}