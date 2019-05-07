using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using FluentValidation;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;
using System.Security.Authentication;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Users
{
    public class UserLogin
    {
        public class Request : IRequest<Response>
        {
            public string Location { get; set; }

            public string Username { get; set; }

            public string Password { get; set; }

            internal string TenantCode => Location.Split('/').First();

            internal string BranchCode => Location.Split('/').Last();
        }

        public class Response
        {
            public string Token { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                var locationCompositionMessage = $"{nameof(Request.Location)} should be composed of tenant code and branch code (ex tenant/branch).";

                RuleFor(x => x.Location).NotEmpty().NotNull()
                    .Must(x => x.Contains("/")).WithMessage(locationCompositionMessage);

                RuleFor(x => x.Username).NotEmpty().NotNull();

                RuleFor(x => x.Password).NotEmpty().NotNull();
            }
        }

        public class Handler : AbstractRequestHandler<Request, Response>
        {
            private readonly ITokenProvider _tokenProvider;

            public Handler(IHandlerDependencyHolder holder, ITokenProvider tokenProvider)
                : base(holder) => _tokenProvider = tokenProvider;

            public override async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var tenant = await Db.Membership.Tenants.AsQueryable()
                    .FirstOrDefaultAsync(x => x.Code == request.TenantCode);

                var branch = await Db.Membership.Branches.AsQueryable()
                    .FirstOrDefaultAsync(x => x.Code == request.BranchCode);

                var user = await this.Db.Membership
                    .Users.AsQueryable()
                    .FirstOrDefaultAsync(x => 
                        x.Username == request.Username &&
                        x.TenantId == tenant.Id &&
                        x.BranchIds.Contains(branch.Id), 
                        cancellationToken
                    );

                var verified = user?.VerifyPassword(request.Password);

                if (verified != true)
                {
                    throw new InvalidCredentialException("Location, Username or Password is incorrect");
                }

                var token = _tokenProvider.Encode(new Context(tenant.Id, branch.Id, user.Id));

                return new Response() { Token = token.Value };
            }
        }
    }
}
