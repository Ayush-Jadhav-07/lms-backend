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
    [Route("api/mentor/assignments")]
    [Authorize(Roles = "Mentor")]
    public class MentorAssignmentController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MentorAssignmentController(AppDbContext db)
        {
            _db = db;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost]
        public async Task<IActionResult> CreateAssignment(CreateAssignmentDto dto)
        {
            var mentorId = GetUserId();

            var course = await _db.Courses.FirstOrDefaultAsync(x => x.CourseId == dto.CourseId && x.MentorId == mentorId);
            if (course == null) return BadRequest("Invalid course OR not your course.");

            var assignment = new Assignment
            {
                CourseId = dto.CourseId,
                Title = dto.Title,
                Description = dto.Description ?? "",
                DueDate = dto.DueDate
            };

            _db.Assignments.Add(assignment);
            await _db.SaveChangesAsync();

            return Ok(assignment);
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetAssignmentsByCourse(int courseId)
        {
            var mentorId = GetUserId();

            var course = await _db.Courses.FirstOrDefaultAsync(x => x.CourseId == courseId && x.MentorId == mentorId);
            if (course == null) return BadRequest("Not your course.");

            var list = await _db.Assignments
                .Where(a => a.CourseId == courseId)
                .OrderByDescending(a => a.AssignmentId)
                .ToListAsync();

            return Ok(list);
        }

        [HttpGet("{assignmentId}/submissions")]
        public async Task<IActionResult> GetSubmissions(int assignmentId)
        {
            var mentorId = GetUserId();

            var assignment = await _db.Assignments
                .Include(a => a.Course)
                .FirstOrDefaultAsync(a => a.AssignmentId == assignmentId);

            if (assignment == null) return NotFound("Assignment not found.");
            if (assignment.Course?.MentorId != mentorId) return Forbid("Not your assignment.");

            var submissions = await _db.AssignmentSubmissions
                .Include(s => s.Student)
                .Where(s => s.AssignmentId == assignmentId)
                .OrderByDescending(s => s.SubmittedAt)
                .Select(s => new
                {
                    s.SubmissionId,
                    s.AssignmentId,
                    s.StudentId,
                    studentName = s.Student!.FirstName + " " + s.Student!.LastName,
                    s.SubmissionUrl,
                    s.SubmittedAt
                })
                .ToListAsync();

            return Ok(submissions);
        }
    }
}
