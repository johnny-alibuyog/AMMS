using AMMS.Domain.Users;
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
        private readonly UserContext _userContext;

        public AuthProvider(ILogger log, IContext context, DbContext dbContext)
        {
            _log = log;
            _context = context;
            _userContext = dbContext.UserContext;
        }

        public void Evaluate(IEnumerable<IAccessControl> accessControls)
        {
            if (accessControls == null || !accessControls.Any())
                return;

            var user = _userContext
                .Users.AsQueryable()
                .Where(x =>
                    x.Id == _context.UserId &&
                    x.BranchId == _context.BranchId &&
                    x.TenantId == _context.TenantId
                )
                .FirstOrDefault();

            if (user == null)
                throw new AuthenticationException();

            var permissions = _userContext
                .Roles.AsQueryable()
                .Where(x => user.RoleIds.Contains(x.Id))
                .SelectMany(x => x.Permissions)
                .ToArray();

            foreach (var accessControl in accessControls)
            {
                if (permissions.Any(perms => !perms.HasPermission(accessControl.Area, accessControl.Access)))
                {
                    throw new UnauthorizedAccessException($"You don not have {accessControl.Access} to {accessControl.Area}");
                }
            }
        }
    }
}
