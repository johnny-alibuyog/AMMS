namespace AMMS.Domain.Common.Pipes.Auth
{
    public interface IContext
    {
        string TenantId { get; }

        string BranchId { get; }

        string UserId { get; }
    }

    public class Context : IContext
    {
        public string TenantId { get; private set; }

        public string BranchId { get; private set; }

        public string UserId { get; private set; }

        public Context(string tenantId, string branchId, string userId)
        {
            TenantId = tenantId;
            BranchId = branchId;
            UserId = userId;
        }
    }

    public interface IContextProvider
    {
        IContext GetContext();
    }

    public class ContextProvider : IContextProvider
    {
        private readonly ITokenProvider _tokenProvider;
        private readonly ITokenExtractor _tokenExtractor;

        public ContextProvider(ITokenProvider tokenProvider, ITokenExtractor tokenExtractor)
        {
            _tokenProvider = tokenProvider;
            _tokenExtractor = tokenExtractor;
        }

        public IContext GetContext()
        {
            var token = _tokenExtractor.Extract();

            if (token == null)
            {
                return new Context(null, null, null);
            }

            return _tokenProvider.Decode<Context>(token);
        }
    }
}
