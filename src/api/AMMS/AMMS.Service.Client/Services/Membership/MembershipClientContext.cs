using AMMS.Domain.Membership.Messages.Users;

namespace AMMS.Service.Client.Services.Membership
{
    public class MembershipClientContext
    {
        public TenantClient Tenants { get; }

        public BranchClient Branches { get; }

        public UserClient Users { get; }

        public MembershipClientContext(RestClientFacade restClient)
        {
            Tenants = new TenantClient(restClient);

            Branches = new BranchClient(restClient);

            Users = new UserClient(restClient);
        }
    }
}
