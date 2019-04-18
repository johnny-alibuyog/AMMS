using AMMS.Domain.Membership.Models;

namespace AMMS.Domain.Common.Pipes.Auth
{
    public interface IAccessControl
    {
        Area Area { get; }

        Access Access { get; }
    }

    public interface IAccessControl<TRequest> : IAccessControl
    {
        void With((Area Area, Access Access) permission);
    }

    public class AccessControl<TRequest> : IAccessControl<TRequest>
    {
        public Area Area { get; private set; }

        public Access Access { get; private set; }

        public void With((Area Area, Access Access) permission)
        {
            Area = permission.Area;
            Access = permission.Access;
        }
    }
}
