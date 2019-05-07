using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Host.Common.Client;
using AMMS.Test.Integration.Utils;

namespace AMMS.Test.Integration
{
    public class ApiProvider
    {
        public static ClientApi CreateApi(UserLogin.Request loginCredentials = null)
        {
            var settings = SettingsProvider.GetSettings();

            return new ClientApi(settings.ApiEndpoint, loginCredentials ?? new UserLogin.Request()
            {
                Location = "super_tenant/super_branch",
                Username = "super_user",
                Password = "123!@#qweQWE"
            });
        }

        public static ClientApi CreateApi(DummyEnvironment env)
        {
            var settings = SettingsProvider.GetSettings();

            return new ClientApi(settings.ApiEndpoint, new UserLogin.Request()
            {
                Location = $"{env.Tenant.Code}/{env.Branch.Code}",
                Username = env.User.Username,
                Password = env.DefaultPassword
            });
        }
    }
}
