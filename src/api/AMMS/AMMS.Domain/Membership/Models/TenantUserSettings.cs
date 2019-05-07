using AMMS.Domain.Common.Models;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Membership.Models
{
    public class TenantUserSettings : Settings
    {
        public string DefaultPassword { get; private set; }

        public TenantUserSettings(string tenantId, string defaultPassword, string id = null)
        {
            Id = id;
            TenantId = tenantId;
            DefaultPassword = defaultPassword;
        }
    }

    public class TenantUserSettingsMap : ClassMap<TenantUserSettings>
    {
        public override void Map(BsonClassMap<TenantUserSettings> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.DefaultPassword)
                .SetIsRequired(true);

            cm.MapCreator(x => new TenantUserSettings(x.TenantId, x.DefaultPassword, x.Id));
        }
    }
}
