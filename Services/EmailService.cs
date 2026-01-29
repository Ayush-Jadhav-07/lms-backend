using System.Net;
using System.Net.Mail;

namespace Online_LMS.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var settings = _config.GetSection("EmailSettings");

            var message = new MailMessage
            {
                From = new MailAddress(settings["FromEmail"]!, "LMS Support"),
                Subject = subject,
                Body = body,
                IsBodyHtml = false
            };

            message.To.Add(toEmail);

            var smtp = new SmtpClient
            {
                Host = settings["SmtpServer"],
                Port = int.Parse(settings["Port"]!),
                EnableSsl = true,
                Credentials = new NetworkCredential(
                    settings["Username"],
                    settings["Password"]
                )
            };

            await smtp.SendMailAsync(message);
        }
    }
}
