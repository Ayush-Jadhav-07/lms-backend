using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.Models;
using System.Security.Claims;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/student/courses")]
    [Authorize(Roles = "Student")]
    public class StudentCourseController : ControllerBase
    {
        private readonly AppDbContext _db;

        public StudentCourseController(AppDbContext db)
        {
            _db = db;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet]
        public async Task<IActionResult> GetAllCourses([FromQuery] string? search, [FromQuery] int? categoryId)
        {
            var query = _db.Courses
                .Include(x => x.Category)
                .Include(x => x.Mentor)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(x => x.Title.Contains(search) || x.Description.Contains(search));

            if (categoryId != null)
                query = query.Where(x => x.CategoryId == categoryId);

            var list = await query.OrderByDescending(x => x.CourseId).ToListAsync();
            return Ok(list);
        }

        [HttpPost("{courseId}/enroll")]
        public async Task<IActionResult> Enroll(int courseId)
        {
            var studentId = GetUserId();

            var already = await _db.Enrollments.AnyAsync(x => x.CourseId == courseId && x.StudentId == studentId);
            if (already) return BadRequest("Already enrolled.");

            var enrollment = new Enrollment
            {
                CourseId = courseId,
                StudentId = studentId
            };

            _db.Enrollments.Add(enrollment);
            await _db.SaveChangesAsync();

            return Ok("Enrollment successful.");
        }

        [HttpGet("{courseId}/content")]
        public async Task<IActionResult> ViewCourseContent(int courseId)
        {
            var studentId = GetUserId();

            var enrolled = await _db.Enrollments.AnyAsync(x => x.CourseId == courseId && x.StudentId == studentId);
            if (!enrolled) return Forbid("Enroll first to view content.");

            var sections = await _db.CourseSections
                .Where(s => s.CourseId == courseId)
                .Select(s => new
                {
                    s.SectionId,
                    s.SectionName,
                    s.SectionDescription,
                    Topics = _db.SectionTopics.Where(t => t.SectionId == s.SectionId)
                        .Select(t => new
                        {
                            t.TopicId,
                            t.TopicName,
                            t.TopicDescription,
                            Materials = _db.LectureMaterials.Where(m => m.TopicId == t.TopicId).ToList()
                        }).ToList()
                }).ToListAsync();

            return Ok(sections);
        }

        [HttpGet("my")]
        public async Task<IActionResult> MyCourses()
        {
            var studentId = GetUserId();

            var list = await _db.Enrollments
                .Include(e => e.Course)
                .ThenInclude(c => c!.Mentor)
                .Where(e => e.StudentId == studentId)
                .Select(e => e.Course)
                .ToListAsync();

            return Ok(list);
        }
    }
}
