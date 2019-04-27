using AMMS.Domain.Membership.Messages.Users;
using System.Threading.Tasks;

namespace AMMS.Service.Client.Services.Membership
{
    public class UserClient
    {
        private readonly string _resource = "users";
        private readonly RestClientFacade _restClient;

        public UserClient(RestClientFacade restClient) 
            => _restClient = restClient;

        public Task<UserGet.Response> Send(UserGet.Request request)
            => _restClient.Get($"{_resource}/{request.Id}", request);

        public Task<UserCreate.Response> Send(UserCreate.Request request)
            => _restClient.Post($"{_resource}", request);

        public Task<UpdateMessage.Response> Send(UpdateMessage.Request request)
            => _restClient.Put($"{_resource}/{request.Id}", request);

        public Task<UserDelete.Response> Send(UserDelete.Request request)
            => _restClient.Delete($"{_resource}/{request.Id}", request);

        public Task<UserLogin.Response> Send(UserLogin.Request request)
            => _restClient.Post($"login", request);

        public Task<UserChangePassword.Response> Send(UserChangePassword.Request request)
            => _restClient.Post($"changePassword", request);
    }
}
