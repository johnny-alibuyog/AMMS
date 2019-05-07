using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using AutoMapper;
using MediatR;
using MongoDB.Driver;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Branches
{
    public class BranchCreate
    {
        public class Request : Dtos.Branch, IRequest<Response> { }

        public class Response : WithStringId { }

        public class Auth : AccessControl<Request>
        {
            public Auth() => With(Permission.To(Area.Branch, Access.Create));
        }

        public class TransformProfile : Profile
        {
            public TransformProfile()
            {
                CreateMap<Models.Branch, Response>();

                CreateMap<Models.Branch, Request>();
            }
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            public Handler(IHandlerDependencyHolder holder) : base(holder) { }

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var branch = Mapper.Map<Branch>(request);

                branch.SetTenant(Context.TenantId);

                await Db.Membership.Branches.InsertOneAsync(branch, new InsertOneOptions(), cancellationToken);

                return Mapper.Map<Response>(branch);
            }
        }
    }
}
