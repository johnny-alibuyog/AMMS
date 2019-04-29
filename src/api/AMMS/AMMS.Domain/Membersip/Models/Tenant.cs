using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Membership.Models
{
    /// https://web.archive.org/web/20140812091703/http://support.mongohq.com/use-cases/multi-tenant.html
    /// https://stackoverflow.com/questions/2748825/what-is-the-recommended-approach-towards-multi-tenant-databases-in-mongodb
    public class Tenant : Entity, IAggregateRoot
    {
        public string Code { get; protected set; }

        public string Name { get; protected set; }

        public Tenant(string code, string name, string id = null)
        {
            Id = id;
            Code = code;
            Name = name;
        }

        public static Tenant SuperTenant => new Tenant(
            id: "5cbc6f38b9cb4d511fae1ad5", 
            code: "super_tenant",
            name: "Super Tenant"
        );
    }

    public class TenantMap : ClassMap<Tenant>
    {
        public override void Map(BsonClassMap<Tenant> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.Code)
                .SetIsRequired(true);

            cm.MapMember(x => x.Name)
                .SetIsRequired(true);

            cm.MapCreator(x => new Tenant(x.Code, x.Name, x.Id));
        }
    }
}
