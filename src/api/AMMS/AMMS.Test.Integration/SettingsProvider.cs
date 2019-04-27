using Microsoft.Extensions.Configuration;
using System.IO;

namespace AMMS.Test.Integration
{
    public class Settings
    {
        public string ApiEndpoint { get; }

        public Settings(string apiEndpoint) => ApiEndpoint = apiEndpoint;
    }

    public class SettingsProvider
    {
        private static readonly Settings _instance = CreateProvider();

        public static Settings GetSettings() => _instance;

        private static Settings CreateProvider()
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            return new Settings(config["ApiEndpoint"]);
        }
    }
}
