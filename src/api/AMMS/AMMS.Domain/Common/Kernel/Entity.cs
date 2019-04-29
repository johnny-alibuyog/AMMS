using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson.Serialization.Serializers;
using System;

namespace AMMS.Domain.Common.Kernel
{
    /*
    /// abstract generics is not yet supported in mongodb
    // https://jira.mongodb.org/browse/CSHARP-398
    // https://jira.mongodb.org/browse/CSHARP-2325
    public abstract class Entity<TId, TEntity> where TEntity : Entity<TId, TEntity>
    {
        private int? _oldHashCode;

        private bool IsTransient => Equals(Id, default(TId));

        public TId Id { get; protected set; }

        public Entity(TId id) => Id = id;

        #region Equality Comparer

        public override bool Equals(object obj)
        {
            var other = obj as TEntity;
            if (other == null)
                return false;

            //to handle the case of comparing two new objects
            if (IsTransient && other.IsTransient)
                return ReferenceEquals(other, this);

            return other.Id.Equals(Id);
        }

        public override int GetHashCode()
        {
            //This is done se we won't change the hash code
            if (_oldHashCode.HasValue)
            {
                return _oldHashCode.Value;
            }

            //When we are transient, we use the base GetHashCode() and remember it, so an instance can't change its hash code.
            if (IsTransient)
            {
                _oldHashCode = base.GetHashCode();
                return _oldHashCode.Value;
            }

            return Id.GetHashCode();
        }

        public static bool operator ==(Entity<TId, TEntity> x, Entity<TId, TEntity> y) => Equals(x, y);

        public static bool operator !=(Entity<TId, TEntity> x, Entity<TId, TEntity> y) => !(x == y);

        #endregion
    }
    */

    /// https://docs.microsoft.com/en-us/dotnet/standard/microservices-architecture/microservice-ddd-cqrs-patterns/seedwork-domain-model-base-classes-interfaces
    /// https://stackoverflow.com/questions/1958621/whats-an-aggregate-root
    public abstract class Entity
    {
        private int? _oldHashCode;

        private bool IsTransient => Equals(Id, default(string));

        public string Id { get; protected set; }

        #region Equality Comparer

        public override bool Equals(object obj)
        {
            var other = obj as Entity;
            if (other == null)
                return false;

            //to handle the case of comparing two new objects
            if (IsTransient && other.IsTransient)
                return ReferenceEquals(other, this);

            return other.Id.Equals(Id);
        }

        public override int GetHashCode()
        {
            //This is done se we won't change the hash code
            if (_oldHashCode.HasValue)
            {
                return _oldHashCode.Value;
            }

            //When we are transient, we use the base GetHashCode() and remember it, so an instance can't change its hash code.
            if (IsTransient)
            {
                _oldHashCode = base.GetHashCode();
                return _oldHashCode.Value;
            }

            return Id.GetHashCode();
        }

        public static bool operator ==(Entity x, Entity y) => Equals(x, y);

        public static bool operator !=(Entity x, Entity y) => !(x == y);

        #endregion
    }

    public class EntityMap : ClassMap<Entity>
    {
        public override void Map(BsonClassMap<Entity> cm)
        {
            cm.AutoMap();

            cm.SetIdMember(cm.GetMemberMap(x => x.Id)
                .SetSerializer(new StringSerializer(BsonType.ObjectId))
                .SetIdGenerator(StringObjectIdGenerator.Instance));
        }
    }
}
