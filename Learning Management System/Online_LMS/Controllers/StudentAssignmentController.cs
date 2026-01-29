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

        public StudentAssignmentController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // View assignments for a course (only if enrolled)
        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetCourseAssignments(int courseId)
        {
            var studentId = GetUserId();

            var enrolled = await _db.Enrollments.AnyAsync(x => x.CourseId == courseId && x.StudentId == studentId);
            if (!enrolled) return Forbid("Enroll first.");

            var list = await _db.Assignments
                .Where(a => a.CourseId == courseId)
                .OrderByDescending(a => a.AssignmentId)
                .ToListAsync();

            return Ok(list);
        }

        // Submit assignment with file
        [HttpPost("{assignmentId}/submit")]
        public async Task<IActionResult> SubmitAssignment(int assignmentId, IFormFile file)
        {
            var studentId = GetUserId();

            var assignment = await _db.Assignments.FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);
            if (assignment == null) return NotFound("Assignment not found.");

            var enrolled = await _db.Enrollments.AnyAsync(x => x.CourseId == assignment.CourseId && x.StudentId == studentId);
            if (!enrolled) return Forbid("Enroll first.");

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
            Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var submission = new AssignmentSubmission
            {
                AssignmentId = assignmentId,
                StudentId = studentId,
                SubmissionUrl = $"/uploads/{fileName}",
                SubmittedAt = DateTime.UtcNow
            };

            _db.AssignmentSubmissions.Add(submission);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Submitted successfully.", submission });
        }

        // My submissions
        [HttpGet("my-submissions")]
        public async Task<IActionResult> MySubmissions()
        {
            var studentId = GetUserId();

            var list = await _db.AssignmentSubmissions
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

            return Ok(list);
        }
    }
}
