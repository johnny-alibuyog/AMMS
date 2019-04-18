using AMMS.Domain.Common.Models;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Models;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AMMS.Domain.Membership
{
    public class MembershipContext
    {
        public IMongoCollection<User> Users { get; }

        public IMongoCollection<Role> Roles { get; }

        static MembershipContext()
        {
            BsonClassMap.RegisterClassMap(PermissionMap.Map);
            BsonClassMap.RegisterClassMap(RoleMap.Map);
            BsonClassMap.RegisterClassMap(UserMap.Map);
        }

        public MembershipContext(IMongoDatabase database)
        {
            Users = database.GetCollection<User>("users");
            Roles = database.GetCollection<Role>("roles");
        }

        internal void Seed((string tenantId, string branchId, string userDefaultPassword) common)
        {
            var role = Roles.AsQueryable().FirstOrDefault(x => x.TenantId == common.tenantId && x.Name == "Admin");
            if (role == null)
            {
                role = new Role(
                    name: "Admin",
                    tenantId: common.tenantId,
                    permissions: new Permission[]
                    {
                        new Permission(
                            area: Area.User,
                            accessRights: new Access[]
                            {
                                Access.Create,
                                Access.Update,
                                Access.Read,
                                Access.Delete
                            }
                        ),
                        new Permission(
                            area: Area.UserPassword,
                            accessRights: new Access[]
                            {
                                Access.Update,
                            }
                        )

                    }
                );

                Roles.InsertOne(role);
            }

            var user = Users.AsQueryable().FirstOrDefault(x => 
                x.TenantId == common.tenantId &&
                x.BranchId == common.branchId && 
                x.Username == "admin"
            );

            if (user == null)
            {
                user = new User(
                    tenantId: common.tenantId,
                    branchId: common.branchId,
                    username: "admin",
                    person: new Person(
                        firstName: "Admin",
                        lastName: "Sample",
                        middleName: "",
                        birthDate: DateTime.UtcNow
                    ),
                    homeAddress: new Address(
                        street: "Street",
                        barangay: "Barangay",
                        city: "City",
                        province: "Province",
                        region: "Region",
                        country: "Country",
                        zipCode: "ZipCode"
                    ),
                    roleIds: new[] { role.Id }
                );

                user.SetPassword(new HashProvider(), common.userDefaultPassword);

                Users.InsertOne(user);
            }
        }
    }
}
