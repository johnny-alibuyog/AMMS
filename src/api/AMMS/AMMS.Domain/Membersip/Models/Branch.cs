using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Membership.Models
{
    public class Branch : Entity, IAggregateRoot, IHasTenant
    {
        public string TenantId { get; protected set; }

        public string Code { get; protected set; }

        public string Name { get; protected set; }

        public void SetTenant(string tenantId) => TenantId = tenantId;

        public Branch(string tenantId, string code, string name, string id = null)
        {
            Id = id;
            TenantId = tenantId;
            Code = code;
            Name = name;
        }

        public static Branch SuperBranch => new Branch(
            id: "5cbc6faea9df57e2a2687fa3",
            code: "super_branch",
            name: "Super Branch",
            tenantId: Tenant.SuperTenant.Id
        );
    }

    public class BranchMap : ClassMap<Branch>
    {
        public override void Map(BsonClassMap<Branch> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.TenantId)
                .SetIsRequired(true);

            cm.MapMember(x => x.Code)
                .SetIsRequired(true);

            cm.MapMember(x => x.Name)
                .SetIsRequired(true);

            cm.MapCreator(x => new Branch(x.TenantId, x.Code, x.Name, x.Id));
        }
    }
}
