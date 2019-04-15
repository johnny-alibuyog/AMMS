using AMMS.Domain.Common.Models;
using AMMS.Domain.Users.Models;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AMMS.Domain.Users
{
    public class UserContext
    {
        public IMongoCollection<User> Users { get; }

        public IMongoCollection<Role> Roles { get; }

        static UserContext()
        {
            BsonClassMap.RegisterClassMap(PermissionMap.Map);
            BsonClassMap.RegisterClassMap(RoleMap.Map);
            BsonClassMap.RegisterClassMap(UserMap.Map);
        }

        public UserContext(IMongoDatabase database)
        {
            Users = database.GetCollection<User>("users");
            Roles = database.GetCollection<Role>("roles");

            var admin = new Role(
                name: "Admin",
                permissions: new List<Permission>()
                {
                    new Permission(
                        area: Area.Users,
                        accessRights: new Access[]
                        {
                            Access.Create,
                            Access.Update,
                            Access.Read,
                            Access.Delete
                        }
                    )
                }
            );

            if (!this.Roles.AsQueryable().Any())
            {
                

                Roles.InsertOne(admin);
            }

            if (!Users.AsQueryable().Any())
            {
                Users.InsertMany(Enumerable
                    .Range(0, 21)
                    .Select(x => new User(
                        tenantId: null,
                        branchId: null,
                        username: $"username{x}",
                        person: new Person(
                            firstName: $"firstName{x}",
                            lastName: $"lastName{x}",
                            middleName: $"middleName{x}",
                            birthDate: DateTime.UtcNow
                        ),
                        homeAddress: new Address(
                            street: $"street{x}",
                            barangay: $"barangay{x}",
                            city: $"city{x}",
                            province: $"province{x}",
                            region: $"region{x}",
                            country: $"country{x}",
                            zipCode: $"zipCode{x}"
                        ),
                        roleIds: new[] { admin.Id }
                    ))
                    .ToList()
                );
            }
        }
    }
}
