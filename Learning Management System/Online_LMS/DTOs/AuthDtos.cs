using Online_LMS.Models;
using System.ComponentModel.DataAnnotations;

namespace Online_LMS.DTOs
{
    public class RegisterDto
    {
        [Required] public string FirstName { get; set; } = "";
        [Required] public string LastName { get; set; } = "";
        [Required, EmailAddress] public string Email { get; set; } = "";
        [Required] public string Username { get; set; } = "";
        [Required] public string MobileNumber { get; set; } = "";
        [Required] public string Password { get; set; } = "";
        public DateTime? DateOfBirth { get; set; }
        public string Address { get; set; } = "";
        public string Bio { get; set; } = "";
        public string HighestEducation { get; set; } = "";
        public UserRole Role { get; set; } = UserRole.Student;
    }

    public class LoginDto
    {
        [Required] public string Username { get; set; } = "";
        [Required] public string Password { get; set; } = "";
    }

    public class ForgotPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = "";
    }

    public class VerifyOtpDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        public string Otp { get; set; } = "";
    }

    public class ResetPasswordDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        public string NewPassword { get; set; } = "";
    }
}
