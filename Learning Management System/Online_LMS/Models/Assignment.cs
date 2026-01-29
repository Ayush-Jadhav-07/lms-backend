using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public class Assignment
    {
        [Key]
        public int AssignmentId { get; set; }

        public int CourseId { get; set; }
        public Course? Course { get; set; }

        [Required, MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public DateTime? DueDate { get; set; }
    }
}
