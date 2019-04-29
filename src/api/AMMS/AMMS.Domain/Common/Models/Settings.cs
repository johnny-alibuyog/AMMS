using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Common.Models
{
    public abstract class Settings : Entity, IAggregateRoot
    {
        public string TenantId { get; protected set; }
    }

    public class SettingsMap : ClassMap<Settings>
    {
        public override void Map(BsonClassMap<Settings> cm)
        {
            cm.AutoMap();

            cm.SetIsRootClass(true);

            cm.MapMember(x => x.TenantId)
                .SetIsRequired(true);
        }
    }
}
