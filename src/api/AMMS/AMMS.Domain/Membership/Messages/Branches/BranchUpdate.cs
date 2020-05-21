using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Branches
{
    public class BranchUpdate
    {
        public class Request : Dtos.Branch, IRequest<Response> { }

        public class Response { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Branch, Access.Read));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile() => CreateMap<Request, Models.Branch>().ReverseMap();
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var branch = Mapper.Map<Models.Branch>(request);

                branch.SetTenant(Context.TenantId);

                await Db.Membership.Branches.ReplaceOneAsync(x => x.Id == branch.Id, branch, new ReplaceOptions(), cancellationToken);

                return new Response();
            }
        }
    }
}
