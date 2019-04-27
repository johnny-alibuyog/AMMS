using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;

namespace AMMS.Domain.Membership.Models
{
    public class Branch : Entity, IAggregateRoot
    {
        public string Code { get; protected set; }

        public string Name { get; protected set; }

        public string TenantId { get; protected set; }

        public Branch(string code, string name, string tenantId, string id = null)
        {
            Id = id;
            Code = code;
            Name = name;
            TenantId = tenantId;
        }

        public static Branch SuperBranch => new Branch(
            id: "5cbc6faea9df57e2a2687fa3",
            code: "super_branch",
            name: "Super Branch",
            tenantId: Tenant.SuperTenant.Id
        );
    }

    public static class BranchMap
    {
        public static Action<BsonClassMap<Branch>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.Code)
                .SetIsRequired(true);

            map.MapMember(x => x.Name)
                .SetIsRequired(true);

            map.MapMember(x => x.TenantId)
                .SetIsRequired(true);

            map.MapCreator(x => new Branch(x.Code, x.Name, x.TenantId, x.Id));
        };
    }
}
