using AMMS.Domain.Membership.Messages.Branches;
using System.Threading.Tasks;

namespace AMMS.Service.Client.Services.Membership
{
    public class BranchClient
    {
        private readonly string _resource = "branches";
        private readonly RestClientFacade _restClient;

        public BranchClient(RestClientFacade restClient)
            => _restClient = restClient;

        public Task<BranchGet.Response> Send(BranchGet.Request request)
            => _restClient.Get($"{_resource}/{request.Id}", request);

        public Task<BranchCreate.Response> Send(BranchCreate.Request request)
            => _restClient.Post($"{_resource}", request);

        public Task<BranchUpdate.Response> Send(BranchUpdate.Request request)
            => _restClient.Put($"{_resource}/{request.Id}", request);

        public Task<BranchDelete.Response> Send(BranchDelete.Request request)
            => _restClient.Delete($"{_resource}/{request.Id}", request);
    }
}
