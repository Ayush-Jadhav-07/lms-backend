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
    [Route("api/mentor/materials")]
    [Authorize(Roles = "Mentor")]
    public class MentorMaterialController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;

        public MentorMaterialController(AppDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("upload")]
        public async Task<IActionResult> UploadMaterial([FromForm] UploadMaterialDto dto, IFormFile file)
        {
            var mentorId = GetUserId();

            var topic = await _db.SectionTopics
                .Include(x => x.Section)
                .ThenInclude(x => x!.Course)
                .FirstOrDefaultAsync(x => x.TopicId == dto.TopicId);

            if (topic == null) return NotFound("Topic not found.");
            if (topic.Section?.Course?.MentorId != mentorId) return Forbid("Not your topic.");

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads");
            Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            var material = new LectureMaterial
            {
                TopicId = dto.TopicId,
                MaterialType = dto.MaterialType,
                MaterialUrl = $"/uploads/{fileName}",
                Title = dto.Title
            };

            _db.LectureMaterials.Add(material);
            await _db.SaveChangesAsync();

            return Ok(material);
        }
    }
}
