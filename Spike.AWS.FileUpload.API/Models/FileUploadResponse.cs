using System.Collections.Generic;

namespace Spike.AWS.FileUpload.API.Models
{
    public class FileUploadResponse
    {
        public int Total => MailAddressList.Count;

        public string Channel { get; set; }

        public string DncLists { get; set; }

        public string Notes { get; set; }

        public List<MailAddress> MailAddressList { get; set; } =  [];
    }
}