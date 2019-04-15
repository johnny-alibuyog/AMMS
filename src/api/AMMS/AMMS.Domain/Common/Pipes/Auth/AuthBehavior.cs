using AMMS.Domain.Users.Models;
using MediatR;
using Serilog;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Pipes.Auth
{
    public class AuthBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly ILogger _log;
        private readonly IAuthProvider _authProvider;
        private readonly IAccessControl<TRequest>[] _accessControls;

        public AuthBehavior(ILogger log, IAuthProvider authProvider, IAccessControl<TRequest>[] accessControls)
        {
            _log = log;
            _authProvider = authProvider;
            _accessControls = accessControls;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            _log.Warning("**Authenticating** {@rules}", _accessControls);

            // catch it or let it bubble up depending on your strategy
            _authProvider.Evaluate(_accessControls);

            return await next();
        }
    }
}
