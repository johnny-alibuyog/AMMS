using AMMS.Domain.Common.Messages;
using AMMS.Domain.Utils.Extentions;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    public class FindMessage
    {
        public class Request : IRequest<Response> { }

        public class Response : List<Lookup<string>> { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly DbContext _db;

            public Handler(DbContext db) => this._db = db;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var users = await this._db.UserContext
                    .Users.AsQueryable()
                    .Select(x => new Lookup<string>()
                    {
                        Id = x.Id,
                        Name =
                            x.Person.FirstName + " " +
                            x.Person.LastName
                    })
                    .ToListAsync();
                
                return users.MapTo(default(Response));
            }
        }
    }
}
