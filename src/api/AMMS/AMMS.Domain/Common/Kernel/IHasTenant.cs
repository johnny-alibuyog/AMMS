namespace AMMS.Domain.Common.Kernel
{
    public interface IHasTenant
    {
        string TenantId { get; }

        void SetTenant(string tenantId);
    }

}
