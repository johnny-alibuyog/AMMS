using AMMS.Domain.Common.Pipes.Auth;
using AutoMapper;
using MediatR;
using Serilog;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AMMS.Domain.Common.Messages
{
    public interface IHandlerDependencyHolder
    {
        Lazy<DbContext> Db { get; }

        Lazy<ILogger> Logger { get; }

        Lazy<IMapper> Mapper { get; }

        Lazy<IContext> Context { get; }
    }

    public class HandlerDependencyHolder: IHandlerDependencyHolder
    {
        public Lazy<DbContext> Db { get; }

        public Lazy<ILogger> Logger { get; }

        public Lazy<IMapper> Mapper { get; }

        public Lazy<IContext> Context { get; }

        public HandlerDependencyHolder(Lazy<DbContext> db, Lazy<ILogger> logger, Lazy<IMapper> mapper, Lazy<IContext> context)
        {
            Db = db;
            Logger = logger;
            Mapper = mapper;
            Context = context;
        }
    }

    public abstract class AbstractRequestHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly IHandlerDependencyHolder _holder;

        protected DbContext Db => _holder.Db.Value;

        protected ILogger Log => _holder.Logger.Value;

        protected IMapper Mapper => _holder.Mapper.Value;

        protected IContext Context => _holder.Context.Value;

        protected AbstractRequestHandler(IHandlerDependencyHolder holder) => _holder = holder;

        public abstract Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken);
    }
}
