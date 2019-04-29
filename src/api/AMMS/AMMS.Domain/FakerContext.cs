using AMMS.Domain.Common;
using AMMS.Domain.Membership;

namespace AMMS.Domain
{
    public class FakerContext
    {
        public CommonFakerContext Common { get; }

        public MembershipFakerContext Membership { get; }

        public FakerContext()
        {
            Common = new CommonFakerContext();

            Membership = new MembershipFakerContext(Common.Person, Common.Address);
        }
    }
}
