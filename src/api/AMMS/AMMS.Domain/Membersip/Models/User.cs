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

        public string BranchId { get; protected set; }

        public string Username { get; protected set; }

        public string PasswordHash { get; protected set; }

        public string PasswordSalt { get; protected set; }

        public Person Person { get; protected set; }

        public Address HomeAddress { get; protected set; }

        public IEnumerable<string> RoleIds { get; protected set; }

        public User(
            string tenantId,
            string branchId,
            string username,
            Person person,
            Address homeAddress,
            IEnumerable<string> roleIds,
            string id = null)
        {
            Id = id;
            TenantId = tenantId;
            BranchId = branchId;
            Username = username;
            Person = person;
            HomeAddress = homeAddress;
            RoleIds = roleIds;
        }

        internal bool VerifyPassword(IHashProvider hashProvider, string password)
        {
            return hashProvider.VerifyHashString(password, this.PasswordHash, this.PasswordSalt);
        }

        internal void SetPassword(IHashProvider hashProvider, string password)
        {
            (PasswordHash, PasswordSalt) = hashProvider.GenerateHashAndSaltString(password);
        }
    }

    public static class UserMap
    {
        public static Action<BsonClassMap<User>> Map = (map) =>
        {
            map.AutoMap();

            map.MapMember(x => x.TenantId);

            map.MapMember(x => x.BranchId);

            map.MapMember(x => x.Username)
                .SetIsRequired(true);

            map.MapMember(x => x.Person)
                .SetIsRequired(true);

            map.MapMember(x => x.HomeAddress);

            map.MapMember(x => x.RoleIds);

            map.MapCreator(x => 
                new User(
                    x.TenantId, 
                    x.BranchId, 
                    x.Username, 
                    x.Person, 
                    x.HomeAddress, 
                    x.RoleIds, 
                    x.Id
                )
            );
        };
    }
}
