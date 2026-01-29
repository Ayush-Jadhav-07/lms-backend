using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.Models;
using System.Security.Claims;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/student/assignments")]
    [Authorize(Roles = "Student")]
    public class StudentAssignmentController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        // ✅ Centralized S3 base URL (easy to change later)
        private const string S3_BASE_URL =
            "https://lms-media-ash.s3.amazonaws.com/uploads/";

        public StudentAssignmentController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // =====================================
        // VIEW ASSIGNMENTS FOR A COURSE
        // =====================================
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetCourseAssignments(int courseId)
        {
            var studentId = GetUserId();

            var isEnrolled = await _db.Enrollments
                .AnyAsync(e => e.CourseId == courseId && e.StudentId == studentId);

            if (!isEnrolled)
                return Forbid("Enroll first.");

            var assignments = await _db.Assignments
                .Where(a => a.CourseId == courseId)
                .OrderByDescending(a => a.AssignmentId)
                .ToListAsync();

            return Ok(assignments);
        }

        // =====================================
        // SUBMIT ASSIGNMENT WITH FILE
        // =====================================
        [HttpPost("{assignmentId}/submit")]
        public async Task<IActionResult> SubmitAssignment(
            int assignmentId,
            IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required.");

            var studentId = GetUserId();

            var assignment = await _db.Assignments
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null)
                return NotFound("Assignment not found.");

            var isEnrolled = await _db.Enrollments
                .AnyAsync(e => e.CourseId == assignment.CourseId && e.StudentId == studentId);

            if (!isEnrolled)
                return Forbid("Enroll first.");

            // ✅ Local file storage (unchanged)
            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
            Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // ✅ ONLY CHANGE: store S3-style URL
            var submission = new AssignmentSubmission
            {
                AssignmentId = assignmentId,
                StudentId = studentId,
                SubmissionUrl = $"{S3_BASE_URL}{fileName}",
                SubmittedAt = DateTime.UtcNow
            };

            _db.AssignmentSubmissions.Add(submission);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Submitted successfully.",
                submission
            });
        }

        // =====================================
        // VIEW MY SUBMISSIONS
        // =====================================
        [HttpGet("my-submissions")]
        public async Task<IActionResult> MySubmissions()
        {
            var studentId = GetUserId();

            var submissions = await _db.AssignmentSubmissions
                .Include(s => s.Assignment)
                .Where(s => s.StudentId == studentId)
                .OrderByDescending(s => s.SubmittedAt)
                .Select(s => new
                {
                    s.SubmissionId,
                    s.AssignmentId,
                    assignmentTitle = s.Assignment!.Title,
                    s.SubmissionUrl,
                    s.SubmittedAt
                })
                .ToListAsync();

            return Ok(submissions);
        }
    }
}
