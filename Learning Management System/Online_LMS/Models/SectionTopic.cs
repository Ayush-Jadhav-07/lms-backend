using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public class SectionTopic
    {
        [Key]
        public int TopicId { get; set; }

        public int SectionId { get; set; }
        public CourseSection? Section { get; set; }

        [Required, MaxLength(200)]
        public string TopicName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string TopicDescription { get; set; } = string.Empty;
    }
}
