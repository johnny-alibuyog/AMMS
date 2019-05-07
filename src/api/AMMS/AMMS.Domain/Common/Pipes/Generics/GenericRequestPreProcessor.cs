using MediatR.Pipeline;
using Serilog;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Pipes.Generics
{
    public class GenericRequestPreProcessor<TRequest> : IRequestPreProcessor<TRequest>
    {
        private readonly ILogger _logger;

        public GenericRequestPreProcessor(ILogger logger) => _logger = logger;

        public Task Process(TRequest request, CancellationToken cancellationToken)
        {
            _logger.Warning("- Starting Up Request {type}: {@request}", request.GetType().DeclaringType.Name, request);

            return Task.CompletedTask;
        }
    }
}
