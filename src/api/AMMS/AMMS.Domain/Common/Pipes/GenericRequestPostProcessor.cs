using MediatR.Pipeline;
using Serilog;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Pipes
{
    public class GenericRequestPostProcessor<TRequest, TResponse> : IRequestPostProcessor<TRequest, TResponse>
    {
        private readonly ILogger _logger;

        public GenericRequestPostProcessor(ILogger logger) => _logger = logger;

        public Task Process(TRequest request, TResponse response)
        {
            _logger.Warning("- All Done");

            return Task.CompletedTask;
        }
    }
}
