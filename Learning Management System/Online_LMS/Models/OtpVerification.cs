using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public class OtpVerification
    {
        [Key]
        public int Id { get; set; }

        public string Email { get; set; } = "";
        public string Otp { get; set; } = "";
        public DateTime ExpiryTime { get; set; }
        public bool IsUsed { get; set; } = false;
    }
}
