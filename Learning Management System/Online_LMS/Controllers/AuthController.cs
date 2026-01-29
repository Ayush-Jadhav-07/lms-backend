using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Online_LMS.Data;
using Online_LMS.DTOs;
using Online_LMS.Helpers;
using Online_LMS.Models;
using Online_LMS.Services;

namespace Online_LMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;

        public AuthController(
            AppDbContext db,
            IConfiguration config,
            EmailService emailService)
        {
            _db = db;
            _config = config;
            _emailService = emailService;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (await _db.Users.AnyAsync(x =>
                x.Email == dto.Email || x.Username == dto.Username))
                return BadRequest("Email or Username already exists.");

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Username = dto.Username,
                MobileNumber = dto.MobileNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                DateOfBirth = dto.DateOfBirth,
                Address = dto.Address,
                Bio = dto.Bio,
                Role = dto.Role,
                HighestEducation = dto.Role == UserRole.Mentor ? dto.HighestEducation : ""
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok("Registered Successfully.");
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Username == dto.Username);
            if (user == null)
                return Unauthorized("Invalid username.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid password.");

            var token = JwtHelper.GenerateToken(_config, user);

            return Ok(new
            {
                token,
                role = user.Role.ToString(),
                userId = user.UserId,
                username = user.Username
            });
        }

        // ================= FORGOT PASSWORD =================
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if (user == null)
                return BadRequest("Email not registered.");

            var otp = new Random().Next(100000, 999999).ToString();

            user.Otp = otp;
            user.OtpExpiry = DateTime.UtcNow.AddMinutes(5);
            await _db.SaveChangesAsync();

            await _emailService.SendEmailAsync(
                dto.Email,
                "Your LMS OTP Code",
                $"Your OTP is {otp}. It is valid for 5 minutes."
            );

            return Ok("OTP sent to registered email.");
        }

        // ================= VERIFY OTP =================
        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtp(VerifyOtpDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if (user == null)
                return BadRequest("Invalid email.");

            if (user.Otp != dto.Otp)
                return BadRequest("Invalid OTP.");

            if (user.OtpExpiry < DateTime.UtcNow)
                return BadRequest("OTP expired.");

            // mark OTP as used
            user.Otp = null;
            user.OtpExpiry = null;
            await _db.SaveChangesAsync();

            return Ok("OTP verified successfully.");
        }

        // ================= RESET PASSWORD =================
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if (user == null)
                return NotFound("User not found.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await _db.SaveChangesAsync();

            return Ok("Password reset successful.");
        }
    }
}
