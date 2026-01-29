using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.Models;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/admin/categories")]
    [Authorize(Roles = "Admin")]
    public class AdminCategoryController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AdminCategoryController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.Categories.OrderByDescending(x => x.CategoryId).ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Category category)
        {
            _db.Categories.Add(category);
            await _db.SaveChangesAsync();
            return Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Category category)
        {
            var existing = await _db.Categories.FindAsync(id);
            if (existing == null) return NotFound("Category not found.");

            existing.Name = category.Name;
            existing.Description = category.Description;

            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _db.Categories.FindAsync(id);
            if (existing == null) return NotFound("Category not found.");

            _db.Categories.Remove(existing);
            await _db.SaveChangesAsync();

            return Ok("Category deleted.");
        }
    }
}
