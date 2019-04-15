using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;

namespace AMMS.Domain.Common.Models
{
    public class Branch : Entity, IAggregateRoot
    {
        public string Name { get; protected set; }

        public Tenant Tenant { get; protected set; }

        public Branch(string name, Tenant tenant, string id = null)
        {
            Id = id;
            Name = name;
            Tenant = tenant;
        }
    }

    public static class BranchMap
    {
        public static Action<BsonClassMap<Branch>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.Name)
                .SetIsRequired(true);

            map.MapMember(x => x.Tenant)
                .SetIsRequired(true);

            map.MapCreator(x => new Branch(x.Name, x.Tenant, x.Id));
        };
    }
}
