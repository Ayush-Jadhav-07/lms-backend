using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public class AssignmentSubmission
    {
        [Key]
        public int SubmissionId { get; set; }

        public int AssignmentId { get; set; }
        public Assignment? Assignment { get; set; }

        public int StudentId { get; set; }
        public User? Student { get; set; }

        public string SubmissionUrl { get; set; } = string.Empty;

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
