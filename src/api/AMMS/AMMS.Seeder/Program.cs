using AMMS.Domain.Membership.Messages.Users;
using AMMS.Service.Client;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;

namespace AMMS.Seeder
{
    class Program
    {
        // https://stackoverflow.com/questions/38114761/asp-net-core-configuration-for-net-core-console-application
        // https://stackoverflow.com/questions/39231951/how-do-i-access-configuration-in-any-class-in-asp-net-core
        static void Main(string[] args)
        {
            Test();

            Console.ReadLine();
        }

        private static async Task Test()
        {
            var config = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var api = new Api(
                endpoint: config["ApiEndpoint"],
                loginCredentials: new UserLogin.Request()
                {
                    Username = "admin",
                    Password = "sample"
                }
            );

            var user = await api.Membership.Users.Send(new UserGet.Request() { Id = "5cb7613a83501529a448cac0" });

            Console.WriteLine(user);
        }
    }
}
