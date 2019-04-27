using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Client;

namespace AMMS.Test.Integration
{
    public class ApiProvider
    {
        public static Api CreateApi(UserLogin.Request loginCredentials = null)
        {
            var settings = SettingsProvider.GetSettings();

            return new Api(settings.ApiEndpoint, loginCredentials ?? new UserLogin.Request()
            {
                Location = "super_tenant/super_branch",
                Username = "super_user",
                Password = "123!@#qweQWE"
            });
        }
    }
}
