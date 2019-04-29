using AMMS.Domain.Common.Models;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Linq;

namespace AMMS.Domain.Common
{
    public class CommonDbContext
    {
        public IMongoCollection<Settings> Settings { get; }

        public IMongoQueryable<Settings> QueryableSettings => Settings.AsQueryable();

        public CommonDbContext(IMongoDatabase database)
        {
            Settings = database.GetCollection<Settings>("settings");
        }
    }
}