using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System.Collections.Generic;

namespace AMMS.Domain.Membership.Models
{
    public class Role : Entity, IAggregateRoot, IHasTenant
    {
        public string TenantId { get; protected set; }

        public string Name { get; protected set; }

        public IEnumerable<Permission> Permissions { get; protected set; }

        public void SetTenant(string tenantId) => TenantId = tenantId;

        public Role(
            string tenantId,
            string name,
            IEnumerable<Permission> permissions,
            string id = null)
        {
            Id = id;
            TenantId = tenantId;
            Name = name;
            Permissions = permissions;
        }

        public static Role SuperRole => new Role(
            id: "5cbc74db806b7db3b78dcc53",
            name: "Super Role",
            tenantId: Tenant.SuperTenant.Id,
            permissions: new[] { Permission.Super }
        );
    }

    public class RoleMap : ClassMap<Role>
    {
        public override void Map(BsonClassMap<Role> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.TenantId)
                .SetIsRequired(true);

            cm.MapMember(x => x.Name)
                .SetIsRequired(true);

            cm.MapMember(x => x.Permissions)
                .SetIsRequired(true);

            cm.MapCreator(x => new Role(x.TenantId, x.Name, x.Permissions, x.Id));
        }
    }
}
