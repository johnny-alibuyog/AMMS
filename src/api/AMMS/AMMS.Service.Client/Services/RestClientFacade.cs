using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Messages.Users;
using MediatR;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using RestSharp;
using RestSharp.Authenticators;
using RestSharp.Serialization;
using System;
using System.Threading.Tasks;

namespace AMMS.Service.Client.Services
{
    // https://github.com/restsharp/RestSharp
    // https://stackoverflow.com/questions/43849892/can-i-set-a-custom-jsonserializer-to-restsharp-restclient
    // https://gist.github.com/alexeyzimarev/c00b79c11c8cce6f6208454f7933ad24
    public class RestClientFacade
    {
        private readonly IRestClient _client;

        public RestClientFacade(string endpoint, UserLogin.Request credentials)
        {
            _client = new RestClient(endpoint);
            _client.Authenticator = new Authenticator(credentials);
        }

        private IRestRequest CreateRestRequest(string resource, Method method)
        {
            return new RestRequest(resource, method)
            {
                JsonSerializer = new JsonNetSerializer()
            };
        }

        public async Task<TResponse> Get<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
        {
            var restRequest = CreateRestRequest(resource, Method.GET);

            restRequest.AddObject(request);

            return await _client.GetAsync<TResponse>(restRequest);
        }

        public async Task<TResponse> Post<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
        {
            var restRequest = CreateRestRequest(resource, Method.POST);

            restRequest.AddJsonBody(request);

            return await _client.PostAsync<TResponse>(restRequest);
        }

        public async Task<TResponse> Put<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
        {
            var restRequest = CreateRestRequest(resource, Method.PUT);

            restRequest.AddJsonBody(request);

            return await _client.PutAsync<TResponse>(restRequest);
        }

        public async Task<TResponse> Delete<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
        {
            var restRequest = CreateRestRequest(resource, Method.DELETE);

            restRequest.AddJsonBody(request);

            return await _client.DeleteAsync<TResponse>(restRequest);
        }

        public class JsonNetSerializer : IRestSerializer
        {
            static JsonNetSerializer()
            {
                JsonConvert.DefaultSettings = () =>
                {
                    var settings = new JsonSerializerSettings()
                    {
                        Formatting = Formatting.Indented,
                        NullValueHandling = NullValueHandling.Ignore,
                        DateFormatHandling = DateFormatHandling.IsoDateFormat,
                        ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    };
                    settings.Converters.Add(new StringEnumConverter());
                    return settings;
                };
            }

            public string Serialize(object obj) =>
                JsonConvert.SerializeObject(obj);

            public string Serialize(Parameter bodyParameter) =>
               JsonConvert.SerializeObject(bodyParameter.Value);

            public T Deserialize<T>(IRestResponse response) =>
               JsonConvert.DeserializeObject<T>(response.Content);

            public string[] SupportedContentTypes { get; } =
            {
                "application/json",
                "text/json",
                "text/x-json",
                "text/javascript",
                "*+json"
            };
        
            public string ContentType { get; set; } = "application/json";

            public DataFormat DataFormat { get; } = DataFormat.Json;
        }

        public class Authenticator : IAuthenticator
        {
            private Token _authToken;
            private UserLogin.Request _credentials;

            public Authenticator(UserLogin.Request credentials)
            {
                _credentials = credentials;
            }

            public void Authenticate(IRestClient client, IRestRequest request)
            {
                if (_authToken == null)
                {
                    _authToken = GetToken(client.BaseUrl);
                }

                request.AddHeader("Authorization", $"Bearer {_authToken.Value}");
            }

            private Token GetToken(Uri baseUrl)
            {
                var client = new RestClient(baseUrl);

                var request = new RestRequest("login/", Method.POST)
                {
                    JsonSerializer = new JsonNetSerializer()
                };

                request.AddJsonBody(_credentials);

                var response = client.Post<UserLogin.Response>(request);

                return response.Data.Token;
            }
        }
    }
}
