using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;

namespace AMMS.Domain.Common.Models
{
    public abstract class Settings : Entity, IAggregateRoot
    {
        public string TenantId { get; protected set; }
    }

    public static class SettingsMap
    {
        public static Action<BsonClassMap<Settings>> Map = (map) =>
        {
            map.AutoMap();

            map.SetIsRootClass(true);

            map.MapMember(x => x.TenantId)
                .SetIsRequired(true);
        };
    }
}
