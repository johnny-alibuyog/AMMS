using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Host.Controllers.Membership;

namespace AMMS.Service.Host.Common.Client;

public class ClientApi
{
    public CommonApi Common { get; }

    public MembershipApi Membership { get; }

    public ClientApi(string endpoint, UserLogin.Request loginCredentials)
    {
        var restClient = new RestClientFacade(endpoint, loginCredentials);

        Common = new CommonApi(restClient);

        Membership = new MembershipApi(restClient);
    }


    public class CommonApi
    {
        public CommonApi(RestClientFacade restClient)
        {

        }
    }

    public class MembershipApi
    {
        public TenantClient Tenants { get; }

        public BranchClient Branches { get; }

        public RoleClient Roles { get; }

        public UserClient Users { get; }

        public MembershipApi(RestClientFacade restClient)
        {
            Tenants = new TenantClient(restClient);

            Branches = new BranchClient(restClient);

            Roles = new RoleClient(restClient);

            Users = new UserClient(restClient);
        }
    }
}
