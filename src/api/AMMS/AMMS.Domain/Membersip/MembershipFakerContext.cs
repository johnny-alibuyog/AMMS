using AMMS.Domain.Common.Messages.Dtos;
using AMMS.Domain.Membership.Messages.Dtos;

namespace AMMS.Domain.Membership
{
    public class MembershipFakerContext
    {
        public TenantFaker Tenant { get; }

        public BranchFaker Branch { get; }

        public UserFaker User { get; }

        public MembershipFakerContext(PersonFaker person, AddressFaker address)
        {
            Tenant = new TenantFaker();

            Branch = new BranchFaker();

            User = new UserFaker(person, address);
        }
    }
}
