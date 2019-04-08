using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using System;
using System.Collections.Generic;
using System.Text;

namespace AMMS.Domain.Users.Entities
{
    public class Role
    {
        public string Id { get; protected set; }

        public string Name { get; protected set; }

        public Role(
            string name,
            string id = null)
        {
            Id = id;
            Name = name;
        }
    }

    public class RoleMap
    {
        public static Action<BsonClassMap<Role>> Map = (map) =>
        {
            map.MapIdMember(x => x.Id)
                .SetSerializer(new StringSerializer(BsonType.ObjectId))
                .SetIdGenerator(StringObjectIdGenerator.Instance);

            map.MapMember(x => x.Name)
                .SetIsRequired(true);

            map.MapCreator(x =>
                new Role(
                    x.Name,
                    x.Id
                )
            );
        };
    }
}
