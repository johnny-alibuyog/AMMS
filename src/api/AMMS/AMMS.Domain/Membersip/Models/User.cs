using AMMS.Domain.Common.Kernel;
using AMMS.Domain.Common.Models;
using AMMS.Domain.Common.Pipes.Auth;
using MongoDB.Bson.Serialization;
using System;
using System.Collections.Generic;

namespace AMMS.Domain.Membership.Models
{
    public class User : Entity, IAggregateRoot
    {
        public string TenantId { get; protected set; }

        public string Username { get; protected set; }

        public string PasswordHash { get; protected set; }

        public string PasswordSalt { get; protected set; }

        public Person Person { get; protected set; }

        public Address HomeAddress { get; protected set; }

        public IEnumerable<string> RoleIds { get; protected set; }

        public IEnumerable<string> BranchIds { get; protected set; }

        public User(
            string tenantId,
            string username,
            Person person,
            Address homeAddress,
            IEnumerable<string> roleIds,
            IEnumerable<string> branchIds,
            string id = null)
        {
            Id = id;
            TenantId = tenantId;
            Username = username;
            Person = person;
            HomeAddress = homeAddress;
            RoleIds = roleIds;
            BranchIds = branchIds;
        }

        internal bool VerifyPassword(IHashProvider hashProvider, string password)
        {
            return hashProvider.VerifyHashString(password, this.PasswordHash, this.PasswordSalt);
        }

        internal void SetPassword(IHashProvider hashProvider, string password)
        {
            (PasswordHash, PasswordSalt) = hashProvider.GenerateHashAndSaltString(password);
        }

        public static User SuperUser => new Func<User>(() =>
        {
            var instance = new User(
                id: "5cc2fbdcdd48549fd685a499",
                tenantId: Tenant.SuperTenant.Id,
                username: "super_user",
                person: new Person(
                    firstName: "User",
                    lastName: "Super",
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
                roleIds: new[] { Role.SuperRole.Id },
                branchIds: new[] { Branch.SuperBranch.Id }
            );

            instance.SetPassword(new HashProvider(), "123!@#qweQWE");

            return instance;
        })(); 
    }

    public static class UserMap
    {
        public static Action<BsonClassMap<User>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.TenantId);

            map.MapMember(x => x.Username)
                .SetIsRequired(true);

            map.MapMember(x => x.Person)
                .SetIsRequired(true);

            map.MapMember(x => x.HomeAddress);

            map.MapMember(x => x.RoleIds);

            map.MapMember(x => x.BranchIds);

            map.MapCreator(x => 
                new User(
                    x.TenantId, 
                    x.Username, 
                    x.Person, 
                    x.HomeAddress, 
                    x.RoleIds,
                    x.BranchIds,
                    x.Id
                )
            );
        };
    }
}
