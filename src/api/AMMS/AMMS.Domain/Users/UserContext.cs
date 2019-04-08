using AMMS.Domain.Common.Entities;
using AMMS.Domain.Users.Entities;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Linq;

namespace AMMS.Domain.Users
{
    public class UserContext
    {
        public IMongoCollection<User> Users { get; }

        public IMongoCollection<Role> Roles { get; }

        public IMongoCollection<Permission> Permissions { get; }

        static UserContext()
        {
            BsonClassMap.RegisterClassMap(PermissionMap.Map);
            BsonClassMap.RegisterClassMap(RoleMap.Map);
            BsonClassMap.RegisterClassMap(UserMap.Map);
        }

        public UserContext(IMongoDatabase database)
        {
            this.Users = database.GetCollection<User>("users");
            this.Roles = database.GetCollection<Role>("roles");
            this.Permissions = database.GetCollection<Permission>("permissions");

            if (!this.Users.AsQueryable().Any())
            {
                this.Users.InsertMany(
                    Enumerable.Range(0, 21)
                        .Select(x => new User(
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
                            )
                        ))
                        .ToList()
                );
            }

            if (!this.Roles.AsQueryable().Any())
            {
                this.Roles.InsertMany(
                    Enumerable.Range(0, 10)
                        .Select(x => new Role($"role{x}"))
                        .ToList()
                );
            }

            if (!this.Permissions.AsQueryable().Any())
            {
                this.Permissions.InsertMany(
                    Enumerable.Range(0, 10)
                        .Select(x => new Permission($"permission{x}"))
                        .ToList()
                );
            }
            
        }
    }
}
