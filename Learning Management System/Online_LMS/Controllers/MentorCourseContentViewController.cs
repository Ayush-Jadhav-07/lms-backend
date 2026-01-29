using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.Models;
using System.Security.Claims;

namespace Online_LMS.Controllers
{

    [ApiController]
    [Route("api/mentor/course-content")]
    [Authorize(Roles = "Mentor")]
    public class MentorCourseContentViewController : ControllerBase
    {
        private readonly AppDbContext _db;
        public MentorCourseContentViewController(AppDbContext db) { _db = db; }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpGet("{courseId}")]
        public async Task<IActionResult> GetCourseFullContent(int courseId)
        {
            var mentorId = GetUserId();

            var course = await _db.Courses
                .FirstOrDefaultAsync(c => c.CourseId == courseId && c.MentorId == mentorId);

            if (course == null) return NotFound("Course not found or not yours.");

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
                })
                .ToListAsync();

            return Ok(new { course, sections });
        }
    }
}
