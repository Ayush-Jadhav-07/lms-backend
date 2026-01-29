using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.DTOs;
using Online_LMS.Models;
using System.Security.Claims;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/mentor/content")]
    [Authorize(Roles = "Mentor")]
    public class MentorSectionTopicController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MentorSectionTopicController(AppDbContext db)
        {
            _db = db;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("sections")]
        public async Task<IActionResult> AddSection(CreateSectionDto dto)
        {
            var mentorId = GetUserId();

            var course = await _db.Courses.FirstOrDefaultAsync(x => x.CourseId == dto.CourseId && x.MentorId == mentorId);
            if (course == null) return BadRequest("Invalid course OR not your course.");

            var section = new CourseSection
            {
                CourseId = dto.CourseId,
                SectionName = dto.SectionName,
                SectionDescription = dto.SectionDescription ?? ""
            };

            _db.CourseSections.Add(section);
            await _db.SaveChangesAsync();

            return Ok(section);
        }

        [HttpPost("topics")]
        public async Task<IActionResult> AddTopic(CreateTopicDto dto)
        {
            var mentorId = GetUserId();

            var section = await _db.CourseSections
                .Include(x => x.Course)
                .FirstOrDefaultAsync(x => x.SectionId == dto.SectionId);

            if (section == null) return NotFound("Section not found.");
            if (section.Course?.MentorId != mentorId) return Forbid("Not your course section.");

            var topic = new SectionTopic
            {
                SectionId = dto.SectionId,
                TopicName = dto.TopicName,
                TopicDescription = dto.TopicDescription ?? ""
            };

            _db.SectionTopics.Add(topic);
            await _db.SaveChangesAsync();

            return Ok(topic);
        }
    }
}
