using AMMS.Domain.Membership.Messages.Users;

namespace AMMS.Service.Client.Services.Membership
{
    public class MembershipClientContext
    {
        public TenantClient Tenants { get; }

        public BranchClient Branches { get; }

        public RoleClient Roles { get; }

        public UserClient Users { get; }

        public MembershipClientContext(RestClientFacade restClient)
        {
            Tenants = new TenantClient(restClient);

            Branches = new BranchClient(restClient);

            Roles = new RoleClient(restClient);

            Users = new UserClient(restClient);
        }
    }
}
