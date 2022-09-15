using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Users;

public class UserGet
{
    public class Request : WithStringId, IRequest<Response> { }

    public class Response : Dtos.User { }

    public class Auth : AccessControl<Request>
    {
        public Auth() => With(Permission.To(Area.User, Access.Read));
    }

    public class TransformProfile : Profile
    {
        public TransformProfile() => CreateMap<User, Response>().ReverseMap();
    }

    public class Handler : AbstractRequestHandler<Request, Response>
    {
        public Handler(IHandlerDependencyHolder holder) : base(holder) { }

        public override async Task<Response> Handle(Request request, CancellationToken cancellationtoken)
        {
            var user = await this.Db.Membership.Users.AsQueryable()
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationtoken);

            return Mapper.Map<Response>(user);
        }
    }
}