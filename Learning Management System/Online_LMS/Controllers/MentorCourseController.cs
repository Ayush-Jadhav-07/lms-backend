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
    [Route("api/mentor/courses")]
    [Authorize(Roles = "Mentor")]
    public class MentorCourseController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public MentorCourseController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromForm] CreateCourseDto dto, IFormFile? thumbnail)
        {
            var mentorId = GetUserId();

            string? savedThumbnailUrl = null;

            if (thumbnail != null)
            {
                var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
                Directory.CreateDirectory(uploadsPath);

                var fileName = $"{Guid.NewGuid()}_{thumbnail.FileName}";
                var filePath = Path.Combine(uploadsPath, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await thumbnail.CopyToAsync(stream);

                savedThumbnailUrl = $"/uploads/{fileName}";
            }

            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                MentorId = mentorId,
                ThumbnailUrl = savedThumbnailUrl,
                ExtraNote = dto.ExtraNote
            };

            _db.Courses.Add(course);
            await _db.SaveChangesAsync();

            return Ok(course);
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyCourses()
        {
            var mentorId = GetUserId();

            var list = await _db.Courses
                .Include(x => x.Category)
                .Where(x => x.MentorId == mentorId)
                .OrderByDescending(x => x.CourseId)
                .ToListAsync();

            return Ok(list);
        }

        [HttpPut("{courseId}")]
        public async Task<IActionResult> UpdateCourse(int courseId, UpdateCourseDto dto)
        {
            var mentorId = GetUserId();
            var course = await _db.Courses.FirstOrDefaultAsync(x => x.CourseId == courseId && x.MentorId == mentorId);

            if (course == null) return NotFound("Course not found.");

            course.Title = dto.Title;
            course.Description = dto.Description;
            course.CategoryId = dto.CategoryId;
            course.ExtraNote = dto.ExtraNote;

            await _db.SaveChangesAsync();
            return Ok(course);
        }

        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var mentorId = GetUserId();
            var course = await _db.Courses.FirstOrDefaultAsync(x => x.CourseId == courseId && x.MentorId == mentorId);

            if (course == null) return NotFound("Course not found.");

            _db.Courses.Remove(course);
            await _db.SaveChangesAsync();
            return Ok("Course deleted.");
        }
    }
}
