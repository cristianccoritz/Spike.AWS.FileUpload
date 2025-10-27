using Amazon.Lambda.APIGatewayEvents;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Net.Http.Headers;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using Spike.AWS.FileUpload.API.Extensions;
using Spike.AWS.FileUpload.API.Json;
using Spike.AWS.FileUpload.API.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace Spike.AWS.FileUpload.API
{
    public class FileUploadFunction
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        private const string DefaultExtension = "xlsx";

        private readonly List<string> AllowedFileExtensions = ["xlsx", "xls"];

        public FileUploadFunction() : this(Startup.ConfigureServices().BuildServiceProvider()) { }

        public FileUploadFunction(IServiceProvider sp)
            : this(sp.GetRequiredService<IServiceScopeFactory>()) { }

        public FileUploadFunction(IServiceScopeFactory serviceScopeFactory) => _serviceScopeFactory = serviceScopeFactory;

        public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(APIGatewayProxyRequest request)
        {
            string responseBody;

            var headers = new Dictionary<string, string> { { "Access-Control-Allow-Origin", Environment.GetEnvironmentVariable("CORS_URI") } };

            var clientId = request.GetValueFromAuthorizerContext("principalId");

            Console.WriteLine("Client Id: {0}", clientId);

            try
            {
                Console.WriteLine("Request Body: {0}", request.Body);
                Console.WriteLine("Request IsBase64Encoded: {0}", request.IsBase64Encoded);

                using var scope = _serviceScopeFactory.CreateScope();
                var serviceProvider = scope.ServiceProvider;

                var errorMessage = ValidateFormDataRequest(request, clientId);

                if (!string.IsNullOrEmpty(errorMessage))
                {
                    Console.WriteLine("FileUpload BadRequest: {0}", errorMessage);

                    return new APIGatewayHttpApiV2ProxyResponse().Set(HttpStatusCode.BadRequest, errorMessage, headers);
                }

                responseBody = DncJsonSerializer.Serialize(await ProcessFormDataRequest(request));

                Console.WriteLine("FileUpload Response: {0}", responseBody);

                return new APIGatewayHttpApiV2ProxyResponse().Set(HttpStatusCode.OK, responseBody, headers);
            }
            catch (Exception ex)
            {
                responseBody = ex.Message;

                Console.WriteLine("FileUpload Error: {0}", responseBody);

                return new APIGatewayHttpApiV2ProxyResponse().Set(HttpStatusCode.InternalServerError, responseBody, headers);
            }
        }

        private static string ValidateFormDataRequest(APIGatewayProxyRequest request, string createdBy)
        {
            if (!request.IsBase64Encoded)
                return "Missing uploaded file";

            if (string.IsNullOrWhiteSpace(createdBy))
                return "Invalid client credentials";

            return default;
        }

        private static async Task<FileUploadResponse> ProcessFormDataRequest(APIGatewayProxyRequest request)
        {
            var response = new FileUploadResponse();

            var contentType = request.GetValueFromHeaders("content-type") ?? request.GetValueFromHeaders("Content-Type");
            var boundary = HeaderUtilities.RemoveQuotes(MediaTypeHeaderValue.Parse(contentType).Boundary).Value;

            var bodyBytes = Convert.FromBase64String(request.Body);
            var reader = new MultipartReader(boundary, new MemoryStream(bodyBytes));
            var section = await reader.ReadNextSectionAsync();

            byte[] fileBytes = null;
            string fileName = null;

            Console.WriteLine("Start reading form data");

            while (section != null)
            {
                var contentDisposition = ContentDispositionHeaderValue.Parse(section.ContentDisposition);
                var name = contentDisposition.Name.Value;

                if (contentDisposition.DispositionType.Equals("form-data") && contentDisposition.FileName.HasValue)
                {
                    fileName = contentDisposition.FileName.Value;
                    using var ms = new MemoryStream();
                    await section.Body.CopyToAsync(ms);
                    fileBytes = ms.ToArray();

                    Console.WriteLine("End reading form data");
                }
                else if (name == "channel")
                {
                    using var readerText = new StreamReader(section.Body);
                    var channel = await readerText.ReadToEndAsync();
                    response.Channel = ((Channels)Convert.ToUInt32(channel)).ToString();
                }
                else if (name == "dncLists")
                {
                    using var readerText = new StreamReader(section.Body);
                    response.DncLists = await readerText.ReadToEndAsync();
                }
                else if (name == "notes")
                {
                    using var readerText = new StreamReader(section.Body);
                    response.Notes = await readerText.ReadToEndAsync();
                }

                section = await reader.ReadNextSectionAsync();
            }

            Console.WriteLine("Start reading excel file");
            using var stream = new MemoryStream(fileBytes);

            IWorkbook workbook = GetFileExtension(fileName) == DefaultExtension
                ? new XSSFWorkbook(stream)
                : new HSSFWorkbook(stream);

            ISheet sheet = workbook.GetSheetAt(0);

            Console.WriteLine("Set address mail list");
            for (int i = 1; i <= sheet.LastRowNum; i++)
            {
                IRow row = sheet.GetRow(i);

                var mailAddress = new MailAddress
                {
                    Street1 = row?.GetCell(0)?.ToString(),
                    Street2 = row?.GetCell(1)?.ToString(),
                    City = row?.GetCell(2)?.ToString(),
                    State = row?.GetCell(3)?.ToString(),
                    ZipCode = row?.GetCell(4)?.ToString()
                };

                response.MailAddressList.Add(mailAddress);
            }

            return response;
        }

        private static string GetFileExtension(string fileName)
            => fileName[(fileName.LastIndexOf('.') + 1)..].ToLower();
    }
}