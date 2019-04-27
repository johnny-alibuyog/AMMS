using AMMS.Domain.Common.Kernel;
using System.Threading.Tasks;

namespace AMMS.Seeder.Seeders
{
    public class SeedFolder : PrimitiveHolder<string>
    {
        public SeedFolder(string value) : base(value) { }
    }

    public interface ISeeder
    {
        Task Seed();

        Task Reverse();
    }

    public interface IDefaultSeeder : ISeeder { }

    public interface IDummySeeder : ISeeder { }
}
