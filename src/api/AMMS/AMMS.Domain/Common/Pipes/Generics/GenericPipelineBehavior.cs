using MediatR;
using Serilog;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Pipes.Generics
{
    public class GenericPipelineBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    {
        private readonly ILogger _logger;

        public GenericPipelineBehavior(ILogger logger) => _logger = logger;

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            _logger.Warning("-- Handling Request");
            var response = await next();
            _logger.Warning("-- Finished Request");
            return response;
        }
    }
}
