using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Client.Services;
using AMMS.Service.Client.Services.Common;
using AMMS.Service.Client.Services.Membership;

namespace AMMS.Service.Client
{
    public class Api
    {
        public TenantClient Tenants { get; }

        public BranchClient Branches { get; }

        public UserClient Users { get; }

        public Api(string endpoint, UserLogin.Request loginCredentials)
        {
            var restClient = new RestClientFacade(endpoint, loginCredentials);

            Tenants = new TenantClient(restClient);

            Branches = new BranchClient(restClient);

            Users = new UserClient(restClient);
        }
    }
}
