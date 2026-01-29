using System.ComponentModel.DataAnnotations;

namespace Online_LMS.DTOs
{
    public class CreateAssignmentDto
    {
        [Required] public int CourseId { get; set; }
        [Required] public string Title { get; set; } = "";
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
    }
}
