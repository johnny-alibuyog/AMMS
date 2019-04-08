using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using System;

namespace AMMS.Domain.Users.Entities
{
    public class Permission
    {
        public string Id { get; protected set; }

        public string Name { get; protected set; }

        public Permission(
            string name, 
            string id = null)
        {
            Id = id;
            Name = name;
        }
    }

    public class PermissionMap
    {
        public static Action<BsonClassMap<Permission>> Map = (map) =>
        {
            map.MapIdMember(x => x.Id)
                .SetSerializer(new StringSerializer(BsonType.ObjectId))
                .SetIdGenerator(StringObjectIdGenerator.Instance);

            map.MapMember(x => x.Name)
                .SetIsRequired(true);

            map.MapCreator(x =>
                new Permission(
                    x.Name,
                    x.Id
                )
            );
        };
    }
}
