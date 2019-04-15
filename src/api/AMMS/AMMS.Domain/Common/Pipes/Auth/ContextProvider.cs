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
        private readonly Token _token;
        private readonly ITokenProvider _tokenProvider;

        public ContextProvider(Token token, ITokenProvider tokenProvider)
        {
            _token = token;
            _tokenProvider = tokenProvider;
        }

        public IContext GetContext() => _tokenProvider.Decode<Context>(_token);
    }
}
