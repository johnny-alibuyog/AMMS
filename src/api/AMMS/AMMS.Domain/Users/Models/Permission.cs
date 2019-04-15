using AMMS.Domain.Common.Kernel;
using MongoDB.Bson.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AMMS.Domain.Users.Models
{
    public enum Area
    {
        Users
    }

    public enum Access
    {
        Read,
        Create,
        Update,
        Delete
    }

    public class Permission : ValueObject<Permission>
    {
        public Area Area { get; protected set; }

        //[BsonRepresentation(BsonType.String)] TODO: https://stackoverflow.com/questions/47313022/mongodb-c-sharp-driver-serializing-listenum-as-string
        public IEnumerable<Access> AccessRights { get; protected set; }

        public Permission(Area area, IEnumerable<Access> accessRights)
        {
            Area = area;
            AccessRights = accessRights;
        }

        public bool HasPermission(Area area, Access access)
        {
            if (Area != area)
                return false;

            if (!AccessRights.Contains(access))
                return false;

            return true;
        }

        public static (Area area, Access access) To(Area area, Access access) => (area, access);

        public static readonly Permission User = new Permission(Area.Users, new Access[] { Access.Read, Access.Create, Access.Update, Access.Delete });

        public static readonly IEnumerable<Permission> Template = new List<Permission>()
        {
            Permission.User,
        };
    }

    public class PermissionMap
    {
        public static Action<BsonClassMap<Permission>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.Area)
                .SetIsRequired(true);

            map.MapMember(x => x.AccessRights)
                // TODO: https://jira.mongodb.org/browse/CSHARP-2096
                //.SetSerializer(new StringSerializer(BsonType.String))
                .SetIsRequired(true);

            map.MapCreator(x => new Permission(x.Area, x.AccessRights));
        };
    }
}
