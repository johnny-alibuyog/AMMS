using FluentValidation;
using MediatR;
using Serilog;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Pipes.Validation
{
    public class ValidaltionBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly ILogger _log;

        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidaltionBehavior(ILogger log, IEnumerable<IValidator<TRequest>> validators)
        {
            _log = log;
            _validators = validators;
        }

        public Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            _log.Warning("**Validating**");

            var context = new ValidationContext<TRequest>(request);

            var failures = _validators
                .Select(x => x.Validate(context))
                .SelectMany(x => x.Errors)
                .Where(x => x != null)
                .ToList();

            if (failures.Count != 0)
            {
                throw new ValidationException(failures);
            }

            return next();
        }
    }
}
