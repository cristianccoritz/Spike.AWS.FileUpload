using Amazon.Lambda.APIGatewayEvents;

namespace Spike.AWS.FileUpload.API.Extensions
{
    public static class APIGatewayRequestExtensions
    {
        public static string GetValueFromHeaders(this APIGatewayProxyRequest request, string key)
            => request.Headers != null && request.Headers.TryGetValue(key, out var value) ? value : default;

        public static string GetValueFromAuthorizerContext(this APIGatewayProxyRequest request, string key)
            => request.RequestContext?.Authorizer != null
                && request.RequestContext.Authorizer.TryGetValue(key, out var value)
                ? value.ToString() : default;
    }
}