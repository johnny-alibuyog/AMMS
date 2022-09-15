using RestSharp;
using System;
using System.Net;
using System.Text;

namespace AMMS.Service.Host.Common.Client
{
    internal static class RestSharpExtensions
    {
        public static bool IsScuccessStatusCode(this HttpStatusCode responseCode)
        {
            var numericResponse = (int)responseCode;

            const int statusCodeOk = (int)HttpStatusCode.OK;

            const int statusCodeBadRequest = (int)HttpStatusCode.BadRequest;

            return numericResponse >= statusCodeOk &&
                   numericResponse < statusCodeBadRequest;
        }

        public static bool IsSuccessful(this RestResponse response)
        {
            return response.StatusCode.IsScuccessStatusCode()
                && response.ResponseStatus == ResponseStatus.Completed;
        }

        public static void EnsureResponseWasSuccessful(this RestClient client, RestRequest request, RestResponse response)
        {
            if (response.IsSuccessful())
            {
                return;
            }

            var requestUri = client.BuildUri(request);

            throw RestException.CreateException(requestUri, response);
        }
    }

    public class RestException : Exception
    {
        public HttpStatusCode HttpStatusCode { get; private set; }

        public Uri RequestUri { get; private set; }

        public string Content { get; private set; }

        public RestException(
            HttpStatusCode httpStatusCode,
            Uri requestUri,
            string content,
            string message,
            Exception innerException
        ) : base(message, innerException)
        {
            HttpStatusCode = httpStatusCode;
            RequestUri = requestUri;
            Content = content;
        }

        public static RestException CreateException(Uri requestUri, RestResponse response)
        {
            Exception innerException = null;

            var messageBuilder = new StringBuilder();

            messageBuilder.AppendLine($"Processing request [{requestUri}] resulted with following errors:");

            if (response.StatusCode.IsScuccessStatusCode() == false)
            {
                messageBuilder.AppendLine($"- Server responded with unsuccessfult status code: {response.StatusDescription}");
            }

            if (response.ErrorException != null)
            {
                messageBuilder.AppendLine($"- An exception occurred while processing request: {response.ErrorMessage}");

                innerException = response.ErrorException;
            }

            return new RestException(response.StatusCode, requestUri, response.Content, messageBuilder.ToString(), innerException);
        }
    }
}
