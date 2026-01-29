using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public class Certificate
    {
        [Key]
        public int CertificateId { get; set; }

        public int CourseId { get; set; }
        public Course? Course { get; set; }

        public int StudentId { get; set; }
        public User? Student { get; set; }

        public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    }
}
