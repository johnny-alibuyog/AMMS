using AMMS.Domain.Users.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;

namespace AMMS.Domain.Common.Pipes.Auth
{
    public interface IAuthRule<TRequest>
    {
        void With(Role role);

        void With(Permission permission);

        void Evaluate(User user);
    }

    public abstract class AuthRule<TRequest> : IAuthRule<TRequest>
    {
        private readonly ICollection<Role> _roles = new List<Role>();
        private readonly ICollection<Permission> _permissions = new List<Permission>();

        public void With(Role role) => _roles.Add(role);

        public void With(Permission permission) => _permissions.Add(permission);

        public void Evaluate(User user)
        {
            if (user == null)
                throw new AuthenticationException();

            if (!_roles.Any() && !_permissions.Any())
                return;

            if (_roles.Any() && _roles.Any(x => user.HasRole(x)))
                return;

            if (_permissions.Any() || _permissions.Any(x => user.HasPermission(x)))
                return;

            throw new UnauthorizedAccessException();
        }

        public AuthRule() { }

        public AuthRule(Role role) => With(role);

        public AuthRule(Permission permission) => With(permission);

        public AuthRule(Role role, Permission permission)
        {
            With(role);
            With(permission);
        }
    }
}
