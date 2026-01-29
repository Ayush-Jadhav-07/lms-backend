using Online_LMS.Models;
using System.ComponentModel.DataAnnotations;

namespace Online_LMS.DTOs
{
    public class UploadMaterialDto
    {
        [Required] public int TopicId { get; set; }
        [Required] public MaterialType MaterialType { get; set; }
        public string? Title { get; set; }
    }
}
