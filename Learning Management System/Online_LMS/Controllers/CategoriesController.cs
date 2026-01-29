using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CategoriesController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Categories
                .OrderByDescending(x => x.CategoryId)
                .ToListAsync();

            return Ok(list);
        }
    }
}
