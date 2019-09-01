using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Users
{
    //https://stackoverflow.com/questions/50530363/aggregate-lookup-with-c-sharp
    //https://stackoverflow.com/questions/50530363/aggregate-lookup-with-c-sharp
    public class UserFind
    {
        public class Request : IRequest<Response> { }

        public class Response : List<Dtos.User> { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.User, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Lookup<string>, Response>().ReverseMap();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var users = await Db.Membership.Users.AsQueryable()
                    .Where(x => x.TenantId == Context.TenantId)
                    .ToListAsync(cancellationToken);

                return Mapper.Map<Response>(users);
            }
        }
    }
}
