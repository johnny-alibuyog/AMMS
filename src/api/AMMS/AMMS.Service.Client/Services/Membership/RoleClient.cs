using AMMS.Domain.Membership.Messages.Roles;
using System.Threading.Tasks;

namespace AMMS.Service.Client.Services.Membership
{
    public class RoleClient
    {
        private readonly string _resource = "roles";
        private readonly RestClientFacade _restClient;

        public RoleClient(RestClientFacade restClient)
            => _restClient = restClient;

        public Task<RoleGet.Response> Send(RoleGet.Request request)
            => _restClient.Get($"{_resource}/{request.Id}", request);

        public Task<RoleCreate.Response> Send(RoleCreate.Request request)
            => _restClient.Post($"{_resource}", request);

        public Task<RoleUpdate.Response> Send(RoleUpdate.Request request)
            => _restClient.Put($"{_resource}/{request.Id}", request);

        public Task<RoleDelete.Response> Send(RoleDelete.Request request)
            => _restClient.Delete($"{_resource}/{request.Id}", request);
    }
}
