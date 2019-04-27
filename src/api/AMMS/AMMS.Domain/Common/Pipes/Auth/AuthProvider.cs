using AMMS.Domain.Membership;
using AMMS.Domain.Membership.Models;
using MongoDB.Driver;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;

namespace AMMS.Domain.Common.Pipes.Auth
{
    public interface IAuthProvider
    {
        void Evaluate(IEnumerable<IAccessControl> accessControls);
    }

    public class AuthProvider : IAuthProvider
    {
        private readonly ILogger _log;
        private readonly IContext _context;
        private readonly MembershipContext _membershipContext;

        public AuthProvider(ILogger log, IContext context, DbContext dbContext)
        {
            _log = log;
            _context = context;
            _membershipContext = dbContext.Membership;
        }

        public void Evaluate(IEnumerable<IAccessControl> accessControls)
        {
            if (accessControls == null || !accessControls.Any())
                return;

            var user = _membershipContext
                .Users.AsQueryable()
                .Where(x =>
                    x.Id == _context.UserId &&
                    x.TenantId == _context.TenantId &&
                    x.BranchIds.Contains(_context.BranchId)
                )
                .FirstOrDefault();

            if (user == null)
                throw new AuthenticationException();

            var roles = _membershipContext.Roles.AsQueryable().Where(x => user.RoleIds.Contains(x.Id)).ToArray();

            var permissions = roles.SelectMany(x => x.Permissions).ToArray();

            if (permissions.Any(x => x.IsSuperPermission()))
                return;

            foreach (var accessControl in accessControls)
            {
                var hasAccess = permissions.Any(perms => perms.HasPermission(accessControl.Area, accessControl.Access));

                if (!hasAccess)
                {
                    throw new UnauthorizedAccessException($"You don not have {accessControl.Access} access to {accessControl.Area}");
                }
            }
        }
    }
}
