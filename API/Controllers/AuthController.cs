using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using BuyNow.API.Data;
using BuyNow.API.Models;
using BuyNow.API.DTOs;
using BuyNow.API.Services;
using System.Security.Claims;

namespace BuyNow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly BuyNowDbContext _context;
        private readonly IJwtService _jwtService;

        public AuthController(BuyNowDbContext context, IJwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest(new { message = "User with this email already exists" });
            }

            // Create new user
            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                Phone = request.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "User", // All new registrations are Users
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate tokens
            var tokens = _jwtService.GenerateTokens(user);

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                Phone = user.Phone,
                Department = user.Department,
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(new AuthResponse { User = userDto, Tokens = tokens });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return BadRequest(new { message = "Invalid email or password" });
            }

            if (!user.IsActive)
            {
                return BadRequest(new { message = "Account is deactivated" });
            }

            // Generate tokens
            var tokens = _jwtService.GenerateTokens(user);

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                Phone = user.Phone,
                Department = user.Department,
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(new AuthResponse { User = userDto, Tokens = tokens });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponse>> RefreshToken(RefreshTokenRequest request)
        {
            // In a production app, you'd store refresh tokens in the database
            // For simplicity, we'll just validate the format and generate new tokens
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { message = "Invalid refresh token" });
            }

            // Extract user ID from the Authorization header
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            if (authHeader == null || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Invalid authorization header" });
            }

            var token = authHeader.Substring("Bearer ".Length).Trim();
            var userId = _jwtService.ValidateToken(token);

            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null || !user.IsActive)
            {
                return Unauthorized(new { message = "User not found or inactive" });
            }

            // Generate new tokens
            var tokens = _jwtService.GenerateTokens(user);

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                Phone = user.Phone,
                Department = user.Department,
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(new AuthResponse { User = userDto, Tokens = tokens });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                Phone = user.Phone,
                Department = user.Department,
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            return Ok(userDto);
        }

        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // In a production app, you'd invalidate the refresh token in the database
            // For now, we'll just return success as the client will remove the tokens
            return Ok(new { message = "Logged out successfully" });
        }
    }
}
