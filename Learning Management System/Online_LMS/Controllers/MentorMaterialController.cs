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
    [Route("api/mentor/materials")]
    [Authorize(Roles = "Mentor")]
    public class MentorMaterialController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly S3Service _s3Service;

        public MentorMaterialController(AppDbContext db, S3Service s3Service)
        {
            _db = db;
            _s3Service = s3Service;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // =========================
        // UPLOAD MATERIAL (PDF / PPT / DOC / etc.)
        // =========================
        [HttpPost("upload")]
        public async Task<IActionResult> UploadMaterial(
            [FromForm] UploadMaterialDto dto,
            IFormFile file)
        {
            var mentorId = GetUserId();

            var topic = await _db.SectionTopics
                .Include(x => x.Section)
                .ThenInclude(x => x!.Course)
                .FirstOrDefaultAsync(x => x.TopicId == dto.TopicId);

            if (topic == null)
                return NotFound("Topic not found.");

            if (topic.Section?.Course?.MentorId != mentorId)
                return Forbid("Not your topic.");

            // Upload file to S3 (uploads/)
            var materialUrl = await _s3Service.UploadAsync(file);

            var material = new LectureMaterial
            {
                TopicId = dto.TopicId,
                MaterialType = dto.MaterialType,
                MaterialUrl = materialUrl,
                Title = dto.Title
            };

            _db.LectureMaterials.Add(material);
            await _db.SaveChangesAsync();

            return Ok(material);
        }
    }
}
