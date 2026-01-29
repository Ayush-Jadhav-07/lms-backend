using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public class CourseSection
    {
        [Key]
        public int SectionId { get; set; }

        [Required]
        public int CourseId { get; set; }
        public Course? Course { get; set; }

        [Required, MaxLength(200)]
        public string SectionName { get; set; } = string.Empty;

        [MaxLength(400)]
        public string SectionDescription { get; set; } = string.Empty;
    }
}
