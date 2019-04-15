using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;
using System.Collections.Generic;

namespace AMMS.Domain.Users.Models
{
    public class Role : Entity, IAggregateRoot
    {
        public string Name { get; protected set; }

        public IEnumerable<Permission> Permissions { get; protected set; }

        public Role(
            string name,
            IEnumerable<Permission> permissions,
            string id = null)
        {
            Id = id;
            Name = name;
            Permissions = permissions;
        }
    }

    public class RoleMap
    {
        public static Action<BsonClassMap<Role>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.Name)
                .SetIsRequired(true);

            map.MapMember(x => x.Permissions)
                .SetIsRequired(true);

            map.MapCreator(x => new Role(x.Name, x.Permissions, x.Id));
        };
    }
}
