﻿using AMMS.Domain.Common.Kernel;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AMMS.Domain.Membership.Models
{

    [Flags]
    public enum Area
    {
        All,
        Tenant,
        TenantUserSettings,
        Branch,
        Role,
        User,
        UserPassword,
    }

    public enum Access
    {
        Read,
        Create,
        Update,
        Delete,
        Super,
    }

    public class Permission : ValueObject
    {
        public Area Area { get; protected set; }

        [BsonRepresentation(BsonType.String)] // TODO: https://stackoverflow.com/questions/47313022/mongodb-c-sharp-driver-serializing-listenum-as-string
        public IEnumerable<Access> AccessRights { get; protected set; }

        public Permission(Area area, IEnumerable<Access> accessRights)
        {
            Area = area;
            AccessRights = accessRights;
        }

        public bool IsSuperPermission()
        {
            return Area == Area.All && AccessRights.Contains(Access.Super);
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

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Area;
            yield return AccessRights.Aggregate((x, y) => x | y);
        }

        public static readonly Permission Super = new Permission(Area.All, new Access[] { Access.Super });

        public static readonly Permission Tenant = new Permission(Area.Tenant, new Access[] { Access.Read, Access.Create, Access.Update, Access.Delete });

        public static readonly Permission TenantUserSettings = new Permission(Area.TenantUserSettings, new Access[] { Access.Read, Access.Update });

        public static readonly Permission Branch = new Permission(Area.Branch, new Access[] { Access.Read, Access.Create, Access.Update, Access.Delete });

        public static readonly Permission Role = new Permission(Area.Role, new Access[] { Access.Read, Access.Create, Access.Update, Access.Delete });

        public static readonly Permission User = new Permission(Area.User, new Access[] { Access.Read, Access.Create, Access.Update, Access.Delete });

        public static readonly Permission UserPassword = new Permission(Area.UserPassword, new Access[] { Access.Update });

        public static readonly List<Permission> Template = new List<Permission>()
        {
            Permission.Tenant,
            Permission.TenantUserSettings,
            Permission.Branch,
            Permission.Role,
            Permission.User,
            Permission.UserPassword
        };
    }

    public class PermissionMap : ClassMap<Permission>
    {
        public override void Map(BsonClassMap<Permission> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.Area)
                .SetIsRequired(true);

            cm.MapMember(x => x.AccessRights)
                // TODO: https://jira.mongodb.org/browse/CSHARP-2096
                //.SetSerializer(new StringSerializer(BsonType.String))
                .SetIsRequired(true);

            cm.MapCreator(x => new Permission(x.Area, x.AccessRights));
        }
    }
}
