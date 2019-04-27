using AMMS.Domain.Common.Pipes.Auth;
using System;
using System.Threading.Tasks;

namespace AMMS.Seeder.Seeders.DefaultSeeders
{
    public class _001_TenantSeeder : IDefaultSeeder
    {
        private readonly IContext _context;
        private readonly SeedFolder _seedFolder;

        public _001_TenantSeeder(IContext context, SeedFolder seedFolder)
        {
            _context = context;
            _seedFolder = seedFolder;
        }
        public Task Seed() => throw new NotImplementedException();

        public Task Reverse() => throw new NotImplementedException();
    }
}
