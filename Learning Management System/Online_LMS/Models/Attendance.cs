using System.ComponentModel.DataAnnotations;

namespace Online_LMS.Models
{
    public class Attendance
    {
        [Key]
        public int AttendanceId { get; set; }

        public int CourseId { get; set; }
        public Course? Course { get; set; }

        public int StudentId { get; set; }
        public User? Student { get; set; }

        public DateTime AttendanceDate { get; set; } = DateTime.UtcNow.Date;
    }
}
