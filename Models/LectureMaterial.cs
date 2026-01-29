using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public enum MaterialType
    {
        Video = 1,
        Pdf = 2,
        Ppt = 3,
        Link = 4
    }

    public class LectureMaterial
    {
        [Key]
        public int MaterialId { get; set; }

        public int TopicId { get; set; }
        public SectionTopic? Topic { get; set; }

        public MaterialType MaterialType { get; set; }

        [Required]
        public string MaterialUrl { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Title { get; set; }
    }
}
