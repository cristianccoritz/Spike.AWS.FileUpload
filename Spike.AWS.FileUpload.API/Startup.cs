using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Spike.AWS.FileUpload.API
{
    public static class Startup
    {
        public static IServiceCollection ConfigureServices()
        {
            var serviceCollection = new ServiceCollection()
                .AddConfiguration();

            return serviceCollection;
        }

        private static IServiceCollection AddConfiguration(this IServiceCollection services)
        {
            var configuration = new ConfigurationBuilder()
                .AddEnvironmentVariables()
                .Build();

            services.AddScoped<IConfiguration>(_ => configuration);

            return services;
        }
    }
}