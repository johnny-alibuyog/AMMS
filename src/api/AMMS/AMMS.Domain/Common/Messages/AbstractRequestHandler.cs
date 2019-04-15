using AutoMapper;
using MediatR;
using Serilog;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Messages
{
    public abstract class AbstractRequestHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        protected readonly DbContext _db;
        protected readonly ILogger _log;
        protected readonly IMapper _mapper;

        protected AbstractRequestHandler(DbContext db, ILogger log, IMapper mapper)
        {
            _db = db;
            _log = log;
            _mapper = mapper;
        }

        public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
    }
}
