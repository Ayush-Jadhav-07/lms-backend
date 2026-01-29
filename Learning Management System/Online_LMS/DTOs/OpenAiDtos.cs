using System.ComponentModel.DataAnnotations;

namespace Online_LMS.DTOs
{
    public class ImproveTopicDto
    {
        [Required] public string TopicName { get; set; } = "";
        public string? TopicDescription { get; set; }
    }
}
