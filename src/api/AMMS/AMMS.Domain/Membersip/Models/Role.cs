using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;
using System.Collections.Generic;

namespace AMMS.Domain.Membership.Models
{
    public class Role : Entity, IAggregateRoot
    {
        public string TenantId { get; protected set; }

        public string Name { get; protected set; }

        public IEnumerable<Permission> Permissions { get; protected set; }

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
    }

    public class RoleMap
    {
        public static Action<BsonClassMap<Role>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.TenantId)
                .SetIsRequired(true);

            map.MapMember(x => x.Name)
                .SetIsRequired(true);

            map.MapMember(x => x.Permissions)
                .SetIsRequired(true);

            map.MapCreator(x => new Role(x.Name, x.TenantId, x.Permissions, x.Id));
        };
    }
}
