using Amazon.Lambda.APIGatewayEvents;
using System.Collections.Generic;
using System.Net;

namespace Spike.AWS.FileUpload.API.Extensions
{
    public static class APIGatewayResponseExtensions
    {
        public static APIGatewayHttpApiV2ProxyResponse Set(
            this APIGatewayHttpApiV2ProxyResponse reponse,
            HttpStatusCode statusCode,
            string responseBody,
            Dictionary<string, string> headers = null)
        {
            reponse.StatusCode = (int)statusCode;
            reponse.Body = responseBody;
            reponse.Headers = headers;
            return reponse;
        }
    }
}