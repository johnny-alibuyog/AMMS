using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Messages.Users;
using MediatR;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using RestSharp;
using RestSharp.Authenticators;
using RestSharp.Serializers.NewtonsoftJson;
using System;
using System.Threading.Tasks;

namespace AMMS.Service.Host.Common.Client;

// https://github.com/restsharp/RestSharp
// https://stackoverflow.com/questions/43849892/can-i-set-a-custom-jsonserializer-to-restsharp-restclient
// https://gist.github.com/alexeyzimarev/c00b79c11c8cce6f6208454f7933ad24
public class RestClientFacade
{
    private readonly RestClient _client;

    public RestClientFacade(string endpoint, UserLogin.Request credentials)
    {
        _client = new RestClient(new RestClientOptions(endpoint));
        _client.Authenticator = new Authenticator(credentials);
        _client.UseNewtonsoftJson(ConfigureSettings());

        JsonSerializerSettings ConfigureSettings()
        {
            var value = new JsonSerializerSettings()
            {
                Formatting = Formatting.None,
                TypeNameHandling = TypeNameHandling.None,
                NullValueHandling = NullValueHandling.Ignore,
                DefaultValueHandling = DefaultValueHandling.Include,
                DateFormatHandling = DateFormatHandling.IsoDateFormat,
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                ConstructorHandling = ConstructorHandling.AllowNonPublicDefaultConstructor
            };
            value.Converters.Add(new StringEnumConverter());
            return value;
        };

    }

    private RestRequest CreateRestRequest(string resource, Method method)
    {
        return new RestRequest(resource, method);
    }

    public async Task<TResponse> Get<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
    {
        var restRequest = CreateRestRequest(resource, Method.Get);

        restRequest.AddObject(request);

        return await _client.GetAsync<TResponse>(restRequest);
    }

    public async Task<TResponse> Post<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
    {
        var restRequest = CreateRestRequest(resource, Method.Post);

        restRequest.AddJsonBody(request);

        return await _client.PostAsync<TResponse>(restRequest);
    }

    public async Task<TResponse> Put<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
    {
        var restRequest = CreateRestRequest(resource, Method.Put);

        restRequest.AddJsonBody(request);

        return await _client.PutAsync<TResponse>(restRequest);
    }

    public async Task<TResponse> Delete<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
    {
        var restRequest = CreateRestRequest(resource, Method.Delete);

        restRequest.AddJsonBody(request);

        return await _client.DeleteAsync<TResponse>(restRequest);
    }

    public class Authenticator : IAuthenticator
    {
        private Token _authToken;
        private UserLogin.Request _credentials;

        public Authenticator(UserLogin.Request credentials)
        {
            _credentials = credentials;
        }

        public ValueTask Authenticate(RestClient client, RestRequest request)
        {
            _authToken ??= GetToken(client.Options.BaseUrl);

            request.AddHeader("Authorization", $"Bearer {_authToken.Value}");

            return ValueTask.CompletedTask;
        }

        private Token GetToken(Uri baseUrl)
        {
            var client = new RestClient(baseUrl);

            var request = new RestRequest("login/", Method.Post);

            request.AddJsonBody(_credentials);

            var response = client.Post<UserLogin.Response>(request);

            return response.Token;
        }
    }
}
