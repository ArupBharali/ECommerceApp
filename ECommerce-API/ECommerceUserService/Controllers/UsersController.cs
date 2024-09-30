using ECommerceAPI.ECommerceUserAPI.Data;
using ECommerceAPI.ECommerceUserAPI.Data;
using ECommerceAPI.ECommerceUserAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;


namespace ECommerceAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly ECommerceUserDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public UsersController(ECommerceUserDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpGet("search")]
        public async Task<IActionResult> GetUsers([FromQuery] string query)
        {
            var users = await _userManager.Users
               .Where(u => u.UserName.Contains(query) || u.Email.Contains(query)) // Adjust based on your user model
               .Select(u => new { u.Id, u.UserName, u.Email })
               .ToListAsync();

            return Ok(users);
        }
        [HttpGet("details")]
        //[Authorize]
        public async Task<IActionResult> GetUserDetails()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Name)?.Value;

            // Get the authenticated user's ID from the claims
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated" });
            }

            // Fetch the user from the database using UserManager
            var user = await _userManager.FindByIdAsync(userIdClaim);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                User = new
                {
                    user.Id,
                    user.UserName,
                    user.Email
                },
                Roles = roles
            });
        }
        [HttpGet("{id}/roles")]
        //[Authorize]
        public async Task<IActionResult> GetUserRoles(string id)
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Name)?.Value;

            // Get the authenticated user's ID from the claims
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User is not authenticated" });
            }

            // Fetch the user from the database using UserManager
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                User = new
                {
                    user.Id,
                    user.UserName,
                    user.Email
                },
                Roles = roles
            });
        }
        [HttpPut("update")]
        public IActionResult UpdateUserDetails([FromBody] UserUpdateDto userUpdateDto)
        {
            var userId = 1; // Simulate getting the authenticated user's ID
            //var user = _context.ApplicationUsers.FirstOrDefault(u => u.Id == userId);
            var user = _context.ApplicationUsers.FirstOrDefault(u => 1 == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            user.UserName = userUpdateDto.Name;
            user.Email = userUpdateDto.Email;

            _context.SaveChanges();

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email
            });
        }

        [HttpPost("{userId}/roles/assign")]
        public async Task<IActionResult> AssignRoles([FromRoute] string userId, [FromBody] AssignRolesRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            var rolesToAdd = request.Roles.Except(currentRoles); // Only add roles that are not already assigned

            var result = await _userManager.AddToRolesAsync(user, rolesToAdd);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent(); // Return 204 No Content on success
        }
        // Remove roles from a user
        [HttpPost("{userId}/roles/remove")]
        public async Task<IActionResult> RemoveRoles([FromRoute] string userId, [FromBody] AssignRolesRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var rolesToRemove = request.Roles.Intersect(await _userManager.GetRolesAsync(user)).ToList();
            var result = await _userManager.RemoveFromRolesAsync(user, rolesToRemove);

            if (result.Succeeded)
            {
                return Ok("Roles removed successfully");
            }

            return BadRequest("Failed to remove roles");
        }
    }
    // Request models
    public class AssignRolesRequest
    {
        public List<string> Roles { get; set; }
    }
}
