using AMMS.Domain.Membership.Messages.Tenants;
using System.Threading.Tasks;

namespace AMMS.Service.Client.Services.Common
{
    public class TenantClient
    {
        private readonly string _resource = "tenants";
        private readonly RestClientFacade _restClient;

        public TenantClient(RestClientFacade restClient)
            => _restClient = restClient;

        public Task<TenantGet.Response> Send(TenantGet.Request request)
            => _restClient.Get($"{_resource}/{request.Id}", request);

        public Task<TenantCreate.Response> Send(TenantCreate.Request request)
            => _restClient.Post($"{_resource}", request);

        public Task<TenantUpdate.Response> Send(TenantUpdate.Request request)
            => _restClient.Put($"{_resource}/{request.Id}", request);

        public Task<TenantDelete.Response> Send(TenantDelete.Request request)
            => _restClient.Delete($"{_resource}/{request.Id}", request);
    }
}
