using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Client.Services;
using AMMS.Service.Client.Services.Common;
using AMMS.Service.Client.Services.Membership;

namespace AMMS.Service.Client
{
    public class Api
    {
        public CommonClientContext Common { get; }

        public MembershipClientContext Membership { get; }

        public Api(string endpoint, UserLogin.Request loginCredentials)
        {
            var restClient = new RestClientFacade(endpoint, loginCredentials);

            Common = new CommonClientContext(restClient);

            Membership = new MembershipClientContext(restClient);
        }
    }
}
