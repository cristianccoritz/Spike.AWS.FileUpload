using System.Text.Json;

namespace Spike.AWS.FileUpload.API.Json
{
    public static class DncJsonSerializer
    {
        private static readonly JsonSerializerOptions jsonSerializerOptions = new(JsonSerializerDefaults.Web);

        public static T Deserialize<T>(string json) => JsonSerializer.Deserialize<T>(json, jsonSerializerOptions);

        public static string Serialize<T>(T value) => JsonSerializer.Serialize(value, jsonSerializerOptions);
    }
}