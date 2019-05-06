using AMMS.Domain.Common.Kernel;
using AMMS.Domain.Common.Models;
using AMMS.Domain.Common.Pipes.Auth;
using MongoDB.Bson.Serialization;
using System;
using System.Collections.Generic;

namespace AMMS.Domain.Membership.Models
{
    public class User : Entity, IAggregateRoot, IHasTenant
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

        internal bool VerifyPassword(string password, IHashProvider hashProvider = null)
        {
            hashProvider = new HashProvider();

            return hashProvider.VerifyHashString(password, this.PasswordHash, this.PasswordSalt);
        }

        internal void SetPassword(string password, IHashProvider hashProvider = null)
        {
            hashProvider = new HashProvider();

            (PasswordHash, PasswordSalt) = hashProvider.GenerateHashAndSaltString(password);
        }

        public void SetTenant(string tenantId) => TenantId = tenantId;

        internal void SetRoles(string[] roleIds) => RoleIds = roleIds;

        internal void SetBranches(string[] branchIds) => BranchIds = branchIds;

        public static User SuperUser => new Func<User>(() =>
        {
            var instance = new User(
                id: "5cc2fbdcdd48549fd685a499",
                tenantId: Tenant.SuperTenant.Id,
                username: "super_user",
                person: new Person(
                    firstName: "Johnny",
                    lastName: "Alibuyog",
                    middleName: "Asprec",
                    gender: Gender.Male,
                    birthDate: new DateTime(1982, 03, 28)
                ),
                homeAddress: new Address(
                    unit: "#13",
                    street: "Rosal St",
                    subdivision: "Tres Hernamans Ville",
                    district: "Mayamot",
                    municipality: "Antipolo City",
                    province: "Rizal",
                    country: "Philippines",
                    zipCode: "1870"
                ),
                roleIds: new[] { Role.SuperRole.Id },
                branchIds: new[] { Branch.SuperBranch.Id }
            );

            instance.SetPassword("123!@#qweQWE");

            return instance;
        })();
    }

    public class UserMap : ClassMap<User>
    {
        public override void Map(BsonClassMap<User> cm)
        {
            cm.AutoMap();

            cm.MapMember(x => x.TenantId);

            cm.MapMember(x => x.Username)
                .SetIsRequired(true);

            cm.MapMember(x => x.Person)
                .SetIsRequired(true);

            cm.MapMember(x => x.HomeAddress);

            cm.MapMember(x => x.RoleIds);

            cm.MapMember(x => x.BranchIds);

            cm.MapCreator(x =>
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
        }
    }
}
