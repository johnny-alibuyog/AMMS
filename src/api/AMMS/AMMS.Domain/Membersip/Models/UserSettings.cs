using AMMS.Domain.Common.Models;
using MongoDB.Bson.Serialization;
using System;

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

    public static class UserSettingsMap
    {
        public static Action<BsonClassMap<UserSettings>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.DefaultPassword)
                .SetIsRequired(true);

            map.MapCreator(x => new UserSettings(x.TenantId, x.DefaultPassword));
        };
    }
}
