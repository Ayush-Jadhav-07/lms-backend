using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public enum UserRole
    {
        Admin = 1,
        Mentor = 2,
        Student = 3
    }

    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required, MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;

        [Required, MaxLength(15)]
        public string MobileNumber { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(300)]
        public string Address { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Bio { get; set; } = string.Empty;

        [MaxLength(200)]
        public string HighestEducation { get; set; } = string.Empty; // Mentor only

        public UserRole Role { get; set; } = UserRole.Student;

        public string? ProfileImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? Otp { get; set; }
        public DateTime? OtpExpiry { get; set; }
    }
}
