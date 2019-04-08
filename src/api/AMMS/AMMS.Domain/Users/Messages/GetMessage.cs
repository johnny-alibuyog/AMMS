using AMMS.Domain.Common.Messages;
using AMMS.Domain.Utils.Extentions;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class GetMessage
    {
        public class Request : WithStringId, IRequest<Response> { }

        public class Response : Models.User { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly DbContext _db;

            public Handler(DbContext db) => this._db = db;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var user = await this._db.UserContext.Users.AsQueryable()
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                return user.MapTo(default(Response));
            }
        }
    }
}