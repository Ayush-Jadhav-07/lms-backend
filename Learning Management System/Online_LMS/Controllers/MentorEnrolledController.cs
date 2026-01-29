using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.Models;
using System.Security.Claims;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/mentor/enrolled")]
    [Authorize(Roles = "Mentor")]
    public class MentorEnrolledController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MentorEnrolledController(AppDbContext db)
        {
            _db = db;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetEnrolledStudents()
        {
            var mentorId = GetUserId();

            var list = await _db.Enrollments
                .Include(e => e.Course)
                .Include(e => e.Student)
                .Where(e => e.Course!.MentorId == mentorId)
                .OrderByDescending(e => e.EnrollmentId)
                .Select(e => new
                {
                    e.EnrollmentId,
                    courseId = e.CourseId,
                    courseTitle = e.Course!.Title,
                    studentId = e.StudentId,
                    studentName = e.Student!.FirstName + " " + e.Student!.LastName,
                    studentEmail = e.Student!.Email,
                    studentMobile = e.Student!.MobileNumber,
                    e.EnrolledAt
                })
                .ToListAsync();

            return Ok(list);
        }
    }
}
