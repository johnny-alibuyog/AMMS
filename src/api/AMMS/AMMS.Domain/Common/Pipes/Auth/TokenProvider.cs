﻿using AMMS.Domain.Common.Kernel;
using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Serialization;

namespace AMMS.Domain.Common.Pipes.Auth
{
    public class SecretConfig
    {
        public string Key { get; set; }
    }

    public class Token : PrimitiveHolder<string>
    {
        public Token(string value) : base(value) { }

        public static implicit operator string(Token holder) => holder.Value;

        public static implicit operator Token(string value) => new Token(value);
    }

    public interface ITokenExtractor
    {
        Token Extract();
    }

    public interface ITokenProvider
    {
        TPayload Decode<TPayload>(Token token);

        Token Encode<TPayload>(TPayload payload);
    }

    public class TokenProvider : ITokenProvider
    {
        private readonly SecretConfig _secret;

        public TokenProvider(IOptions<SecretConfig> secret)
        {
            _secret = secret.Value;
        }

        private IJsonSerializer GetJsonSerializer()
        {
            var serializer = new JsonSerializer();

            // All json keys start with lowercase characters instead of the exact casing of the model/property, e.g. fullName
            serializer.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Nice and easy to read, but you can also use Formatting.None to reduce the payload size
            serializer.Formatting = Formatting.Indented;

            // The most appropriate datetime format.
            serializer.DateFormatHandling = DateFormatHandling.IsoDateFormat;

            // Don't add keys/values when the value is null.
            serializer.NullValueHandling = NullValueHandling.Ignore;

            // Use the enum string value, not the implicit int value, e.g. "red" for enum Color { Red }
            serializer.Converters.Add(new StringEnumConverter());

            return new JsonNetSerializer(serializer);
        }

        private IJwtAlgorithm GetAlgorithm() => new HMACSHA256Algorithm();

        private IBase64UrlEncoder GetEncoder() => new JwtBase64UrlEncoder();

        private IDateTimeProvider GetDateTimeProvider() => new UtcDateTimeProvider();

        public Token Encode<TPayload>(TPayload payload)
        {
            var encoder = new JwtEncoder(
                jsonSerializer: GetJsonSerializer(), 
                algorithm: GetAlgorithm(), 
                urlEncoder: GetEncoder()
            );

            var token = encoder.Encode(
                payload: payload, 
                key: _secret.Key
            );

            return token;
        }

        public TPayload Decode<TPayload>(Token token)
        {
            var jsonSerializer = GetJsonSerializer();

            var decoder = new JwtDecoder(
                jsonSerializer: jsonSerializer, 
                jwtValidator: new JwtValidator(
                    jsonSerializer: jsonSerializer, 
                    dateTimeProvider: GetDateTimeProvider()
                ), 
                urlEncoder: GetEncoder(),
                algorithm: GetAlgorithm()
            );

            var payload = decoder.DecodeToObject<TPayload>(
                token: token, 
                key: _secret.Key, 
                verify: true
            );

            return payload;
        }
    }
}
