using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;

namespace AMMS.Domain.Common.Models
{
    /// https://web.archive.org/web/20140812091703/http://support.mongohq.com/use-cases/multi-tenant.html
    /// https://stackoverflow.com/questions/2748825/what-is-the-recommended-approach-towards-multi-tenant-databases-in-mongodb
    public class Tenant : Entity, IAggregateRoot
    {
        public string Name { get; protected set; }

        public Tenant(string name, string id = null)
        {
            Id = id;
            Name = name;
        }
    }

    public static class TenantMap
    {
        public static Action<BsonClassMap<Tenant>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.Name)
                .SetIsRequired(true);

            map.MapCreator(x => new Tenant(x.Name, x.Id));
        };
    }
}
