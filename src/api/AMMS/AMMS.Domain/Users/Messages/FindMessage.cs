using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Users.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Serilog;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Users.Messages
{
    //https://stackoverflow.com/questions/50530363/aggregate-lookup-with-c-sharp
    //https://stackoverflow.com/questions/50530363/aggregate-lookup-with-c-sharp
    public class FindMessage
    {
        public class Request : IRequest<Response> { }

        public class Response : List<Lookup<string>> { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Models.Permission.To(Area.Users, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Lookup<string>, Response>();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(DbContext db, ILogger log, IMapper mapper) : base(db, log, mapper) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var users = await _db.UserContext
                    .Users.AsQueryable()
                    .Select(x => new Lookup<string>()
                    {
                        Id = x.Id,
                        Name =
                            x.Person.FirstName + " " +
                            x.Person.LastName
                    })
                    .ToListAsync();

                return _mapper.Map<Response>(users);
            }
        }
    }
}
