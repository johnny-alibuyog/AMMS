using AMMS.Domain.Common.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using System;

namespace AMMS.Domain.Users.Entities
{
    public class User
    {
        public string Id { get; protected set; }

        public string Username { get; protected set; }

        public Person Person { get; protected set; }

        public Address HomeAddress { get; protected set; }

        public User(
            string username,
            Person person,
            Address homeAddress,
            string id = null)
        {
            this.Id = null;
            this.Username = username;
            this.Person = person;
            this.HomeAddress = homeAddress;
        }
    }

    public static class UserMap
    {
        public static Action<BsonClassMap<User>> Map = (map) =>
        {
            map.MapIdMember(x => x.Id)
                .SetSerializer(new StringSerializer(BsonType.ObjectId))
                .SetIdGenerator(StringObjectIdGenerator.Instance);

            map.MapMember(x => x.Username)
                .SetIsRequired(true);

            map.MapMember(x => x.Person)
                .SetIsRequired(true);

            map.MapMember(x => x.HomeAddress);

            map.MapCreator(x => 
                new User(
                    x.Username,
                    x.Person,
                    x.HomeAddress,
                    x.Id
                )
            );
        };
    }
}
