using System.ComponentModel.DataAnnotations;

namespace Online_LMS.DTOs
{
    public class CreateCourseDto
    {
        [Required] public string Title { get; set; } = "";
        [Required] public string Description { get; set; } = "";
        [Required] public int CategoryId { get; set; }
        public string? ExtraNote { get; set; }
    }

    public class UpdateCourseDto
    {
        [Required] public string Title { get; set; } = "";
        [Required] public string Description { get; set; } = "";
        [Required] public int CategoryId { get; set; }
        public string? ExtraNote { get; set; }
    }

    public class CreateSectionDto
    {
        [Required] public int CourseId { get; set; }
        [Required] public string SectionName { get; set; } = "";
        public string? SectionDescription { get; set; }
    }

    public class CreateTopicDto
    {
        [Required] public int SectionId { get; set; }
        [Required] public string TopicName { get; set; } = "";
        public string? TopicDescription { get; set; }
    }
}
