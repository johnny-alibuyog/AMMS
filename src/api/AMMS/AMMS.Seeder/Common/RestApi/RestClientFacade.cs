using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Membership.Messages.Users;
using MediatR;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;
using RestSharp;
using RestSharp.Serialization;
using System.Threading.Tasks;

namespace AMMS.Seeder.Common.RestApi
{
    // https://github.com/restsharp/RestSharp
    // https://stackoverflow.com/questions/43849892/can-i-set-a-custom-jsonserializer-to-restsharp-restclient
    // https://gist.github.com/alexeyzimarev/c00b79c11c8cce6f6208454f7933ad24
    public class RestClientFacade
    {
        private readonly IRestClient _client;
        private readonly LoginMessage.Request _loginCredentials;
        private Token _authToken;

        public RestClientFacade(string endpoint, LoginMessage.Request loginCredentials)
        {
            _client = new RestClient(endpoint);
            _loginCredentials = loginCredentials;
        }

        private IRestRequest CreateRestRequest(string resource, Method method)
        {
            var request = new RestRequest(resource, method)
            {
                JsonSerializer = new JsonNetSerializer()
            };

            if (_authToken != null)
            {
                request.AddHeader("Authorization", $"Bearer {_authToken.Value}");
            }

            return request;
        }

        private async Task EnsureAuth()
        {
            if (_authToken == null)
            {
                var request = CreateRestRequest("login/", Method.POST);

                request.AddJsonBody(_loginCredentials);

                var response = await _client.PostAsync<LoginMessage.Response>(request);

                _authToken = response.Token;
            }
        }

        public async Task<TResponse> Get<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
        {
            await EnsureAuth();

            var restRequest = CreateRestRequest(resource, Method.GET);

            restRequest.AddObject(request);

            return await _client.GetAsync<TResponse>(restRequest);
        }

        public async Task<TResponse> Post<TResponse>(string resource, IRequest<TResponse> request) where TResponse : new()
        {
            await EnsureAuth();

            var restRequest = CreateRestRequest(resource, Method.POST);

            restRequest.AddJsonBody(request);

            return await _client.PostAsync<TResponse>(restRequest);
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

    }
}
