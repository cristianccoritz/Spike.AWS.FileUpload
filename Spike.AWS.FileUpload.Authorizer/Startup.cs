using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Spike.AWS.FileUpload.Authorizer.Settings;

namespace Spike.AWS.FileUpload.Authorizer
{
    public static class Startup
    {
        public static IServiceCollection ConfigureServices()
        {
            var serviceCollection = new ServiceCollection()
                .AddConfiguration();

            return serviceCollection;
        }

        public static IServiceCollection AddConfiguration(this IServiceCollection services)
        {
            var configuration = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();

            var openIdAuthSettings = configuration.GetSection("openIdAuth").Get<OpenIdAuthorizerSettings>();

            services
                .AddScoped<IConfiguration>(_ => configuration)
                .AddSingleton(_ => openIdAuthSettings);

            return services;
        }
    }
}