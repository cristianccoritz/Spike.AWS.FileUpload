namespace Spike.AWS.FileUpload.Authorizer.Settings
{
    public class OpenIdAuthorizerSettings
    {
        public string TenantId { get; set; }

        public string ClientId { get; set; }

        public string PolicyVersion { get; set; } = "2012-10-17";

        public string PolicyAction { get; set; } = "execute-api:Invoke";

        public string PolicyAuthorizedEffect { get; set; } = "Allow";

        public string PolicyUnauthorizedEffect { get; set; } = "Deny";
    }
}