using Amazon;
using Amazon.S3;
using Amazon.S3.Model;

namespace Online_LMS.Services
{
    public class S3Service
    {
        private readonly IAmazonS3 _s3;
        private readonly IConfiguration _config;

        public S3Service(IConfiguration config)
        {
            _config = config;
            _s3 = new AmazonS3Client(
                _config["AWS:AccessKey"],
                _config["AWS:SecretKey"],
                RegionEndpoint.APSouth1
            );
        }

        public async Task<string> UploadAsync(IFormFile file)
        {
            var bucket = _config["AwsS3:BucketName"];
            var folder = _config["AwsS3:Folder"]; // uploads

            var key = $"{folder}/{Guid.NewGuid()}_{file.FileName}";

            var request = new PutObjectRequest
            {
                BucketName = bucket,
                Key = key,
                InputStream = file.OpenReadStream(),
                ContentType = file.ContentType
            };

            await _s3.PutObjectAsync(request);

            return $"https://{bucket}.s3.amazonaws.com/{key}";
        }
    }
}
