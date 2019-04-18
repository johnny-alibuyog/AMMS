using AMMS.Domain.Membership.Messages.Users;
using AMMS.Seeder.Common.RestApi;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace AMMS.Seeder
{
    class Program
    {
        // https://stackoverflow.com/questions/38114761/asp-net-core-configuration-for-net-core-console-application
        // https://stackoverflow.com/questions/39231951/how-do-i-access-configuration-in-any-class-in-asp-net-core
        static void Main(string[] args)
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var api = new ApiBase(config["ApiEndpoint"]);

            var id = "dffdff";

            api.Get($"users/{id}", new GetMessage.Request() { Id = id }).ContinueWith(x => Console.WriteLine(x));

            Console.Read();
        }
    }
}
