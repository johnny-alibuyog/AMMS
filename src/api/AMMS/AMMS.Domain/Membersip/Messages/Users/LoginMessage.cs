using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AutoMapper;
using FluentValidation;
using MediatR;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Serilog;
using System.Linq;
using System.Security.Authentication;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Membership.Messages.Users
{
    public class LoginMessage
    {
        public class Request : IRequest<Response>
        {
            public string Username { get; set; }

            public string Password { get; set; }
        }

        public class Response
        {
            public string Token { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
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
                var user = await this.Db.Membership.Users.AsQueryable()
                    .FirstOrDefaultAsync(x => x.Username == request.Username);

                var verified = user?.VerifyPassword(new HashProvider(), request.Password);

                if (verified != true)
                {
                    throw new InvalidCredentialException("Username or Password is incorrect");
                }

                var token = _tokenProvider.Encode(new Context(user.TenantId, user.BranchId, user.Id));

                return new Response() { Token = token.Value };
            }
        }
    }
}
