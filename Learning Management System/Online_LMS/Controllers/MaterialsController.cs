using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/materials")]
    [Authorize] // Student/Mentor/Admin all can access
    public class MaterialsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MaterialsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMaterial(int id)
        {
            var material = await _db.LectureMaterials
                .FirstOrDefaultAsync(x => x.MaterialId == id);

            if (material == null) return NotFound("Material not found");

            return Ok(material);
        }
    }
}
