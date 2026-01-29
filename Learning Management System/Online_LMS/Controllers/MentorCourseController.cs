using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.DTOs;
using Online_LMS.Models;
using Online_LMS.Services;
using System.Security.Claims;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/mentor/courses")]
    [Authorize(Roles = "Mentor")]
    public class MentorCourseController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly S3Service _s3Service;

        public MentorCourseController(AppDbContext db, S3Service s3Service)
        {
            _db = db;
            _s3Service = s3Service;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // =========================
        // CREATE COURSE
        // =========================
        [HttpPost]
        public async Task<IActionResult> CreateCourse(
            [FromForm] CreateCourseDto dto,
            IFormFile? thumbnail)
        {
            var mentorId = GetUserId();
            string? thumbnailUrl = null;

            // Upload thumbnail to S3 (uploads/)
            if (thumbnail != null)
            {
                thumbnailUrl = await _s3Service.UploadAsync(thumbnail);
            }

            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                MentorId = mentorId,
                ThumbnailUrl = thumbnailUrl,
                ExtraNote = dto.ExtraNote
            };

            _db.Courses.Add(course);
            await _db.SaveChangesAsync();

            return Ok(course);
        }

        // =========================
        // GET MY COURSES
        // =========================
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

        // =========================
        // UPDATE COURSE
        // =========================
        [HttpPut("{courseId}")]
        public async Task<IActionResult> UpdateCourse(
            int courseId,
            UpdateCourseDto dto)
        {
            var mentorId = GetUserId();

            var course = await _db.Courses
                .FirstOrDefaultAsync(x =>
                    x.CourseId == courseId &&
                    x.MentorId == mentorId);

            if (course == null)
                return NotFound("Course not found.");

            course.Title = dto.Title;
            course.Description = dto.Description;
            course.CategoryId = dto.CategoryId;
            course.ExtraNote = dto.ExtraNote;

            await _db.SaveChangesAsync();
            return Ok(course);
        }

        // =========================
        // DELETE COURSE
        // =========================
        [HttpDelete("{courseId}")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var mentorId = GetUserId();

            var course = await _db.Courses
                .FirstOrDefaultAsync(x =>
                    x.CourseId == courseId &&
                    x.MentorId == mentorId);

            if (course == null)
                return NotFound("Course not found.");

            _db.Courses.Remove(course);
            await _db.SaveChangesAsync();

            return Ok("Course deleted.");
        }
    }
}
