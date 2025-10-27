using Amazon.Lambda.APIGatewayEvents;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using Spike.AWS.FileUpload.Authorizer.Settings;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Spike.AWS.FileUpload.Authorizer
{
    public class OpenIdAuthorizerFunction
    {
        private const string ValidIssuer = "https://sts.windows.net/{0}/";
        private const string OpenIdConnectMetadataEndpoint = "https://login.microsoftonline.com/{0}/v2.0/.well-known/openid-configuration";

        private readonly OpenIdAuthorizerSettings _openIdAuthSettings;

        public OpenIdAuthorizerFunction() : this(Startup.ConfigureServices().BuildServiceProvider()) { }

        public OpenIdAuthorizerFunction(IServiceProvider sp) : this(
            sp.GetRequiredService<OpenIdAuthorizerSettings>())
        { }

        public OpenIdAuthorizerFunction(
            OpenIdAuthorizerSettings openIdAuthSettings)
        {
            _openIdAuthSettings = openIdAuthSettings;
        }

        public async Task<APIGatewayCustomAuthorizerResponse> FunctionHandler(APIGatewayCustomAuthorizerRequest request)
        {
            var claimsPrincipal = await GetClaimsPrincipal(request.AuthorizationToken);

            var isAuthorized = claimsPrincipal != null;

            var policy = new APIGatewayCustomAuthorizerPolicy
            {
                Version = _openIdAuthSettings.PolicyVersion,
                Statement =
                [
                    new APIGatewayCustomAuthorizerPolicy.IAMPolicyStatement
                    {
                        Action = new HashSet<string>([_openIdAuthSettings.PolicyAction]),
                        Effect = isAuthorized ? _openIdAuthSettings.PolicyAuthorizedEffect : _openIdAuthSettings.PolicyUnauthorizedEffect,
                        Resource = new HashSet<string>([BuildPolicyResource(request.MethodArn)])
                    }
                ]
            };

            var principalId = claimsPrincipal?.Identity?.Name;

            var contextOutput = new APIGatewayCustomAuthorizerContextOutput
            {
                ["identityName"] = principalId
            };

            Console.WriteLine("CustomAuthorizer Response: {0}", isAuthorized);

            return new APIGatewayCustomAuthorizerResponse
            {
                PrincipalID = principalId,
                PolicyDocument = policy,
                Context = contextOutput
            };
        }

        private async Task<ClaimsPrincipal> GetClaimsPrincipal(string authToken)
        {
            try
            {
                var configManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                    GetMetadataEndpoint(), new OpenIdConnectConfigurationRetriever());

                var oidcConfig = await configManager.GetConfigurationAsync();

                var validationParams = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidateLifetime = true,
                    ValidIssuer = GetIssuer(),
                    ValidAudience = _openIdAuthSettings.ClientId,
                    IssuerSigningKeys = oidcConfig.SigningKeys,
                };

                return new JwtSecurityTokenHandler()
                    .ValidateToken(authToken, validationParams, out var securityToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine("ValidateToken Error: {0}", ex.Message);

                return default;
            }
        }

        private string GetIssuer() => string.Format(ValidIssuer, _openIdAuthSettings.TenantId);

        private string GetMetadataEndpoint() => string.Format(OpenIdConnectMetadataEndpoint, _openIdAuthSettings.TenantId);

        private static string BuildPolicyResource(string methodArn)
        {
            var arnValues = methodArn.Split('/');

            var arnPrefix = arnValues[0];
            var stage = arnValues[1];

            return $"{arnPrefix}/{stage}/*";
        }
    }
}