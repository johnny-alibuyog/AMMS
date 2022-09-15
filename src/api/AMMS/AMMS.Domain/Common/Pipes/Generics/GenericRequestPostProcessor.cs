using MediatR;
using MediatR.Pipeline;
using Serilog;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Pipes.Generics
{
    public class GenericRequestPostProcessor<TRequest, TResponse> : IRequestPostProcessor<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly ILogger _logger;

        public GenericRequestPostProcessor(ILogger logger) => _logger = logger;

        public Task Process(TRequest request, TResponse response, CancellationToken cancellationToken)
        {
            _logger.Warning("- All Done");

            return Task.CompletedTask;
        }
    }
}
