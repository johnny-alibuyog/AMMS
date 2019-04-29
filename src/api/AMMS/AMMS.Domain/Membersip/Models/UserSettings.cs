using AMMS.Domain.Common.Models;
using MongoDB.Bson.Serialization;

namespace AMMS.Domain.Membership.Models
{
    public class UserSettings : Settings
    {
        public string DefaultPassword { get; private set; }

        public UserSettings(string tenantId, string defaultPassword)
        {
            TenantId = tenantId;
            DefaultPassword = defaultPassword;
        }
    }

    public class UserSettingsMap : ClassMap<UserSettings>
    {
        public override void Map(BsonClassMap<UserSettings> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.DefaultPassword)
                .SetIsRequired(true);

            cm.MapCreator(x => new UserSettings(x.TenantId, x.DefaultPassword));
        }
    }
}
