using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UsersController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _db.Users
                .Where(x => x.UserId == id)
                .Select(x => new
                {
                    x.UserId,
                    x.FirstName,
                    x.LastName,
                    x.Email,
                    x.Username,
                    x.MobileNumber,
                    x.DateOfBirth,
                    x.Address,
                    x.Bio,
                    x.HighestEducation,
                    role = x.Role.ToString(),
                    x.ProfileImageUrl
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound("User not found.");
            return Ok(user);
        }

        // PUT: api/users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] dynamic dto)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound("User not found.");

            user.FirstName = dto.firstName ?? user.FirstName;
            user.LastName = dto.lastName ?? user.LastName;
            user.MobileNumber = dto.mobileNumber ?? user.MobileNumber;
            user.Address = dto.address ?? user.Address;
            user.Bio = dto.bio ?? user.Bio;

            await _db.SaveChangesAsync();
            return Ok("Profile updated.");
        }
    }
}
