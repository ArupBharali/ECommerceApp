using ECommerceAPI.ECommerceUserAPI.Data;
using ECommerceAPI.ECommerceUserAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ECommerceUserAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly ECommerceUserDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        public RolesController(ECommerceUserDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _roleManager = roleManager;
        }

        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles.Select(r => new { r.Id, r.Name }));
        }
        //[HttpPost("create")]
        //public async Task<IActionResult> CreateRole(string roleName)
        //{
        //    if (!await _roleManager.RoleExistsAsync(roleName))
        //    {
        //        var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
        //        if (result.Succeeded)
        //        {
        //            // Role created successfully
        //        }
        //    }

        //}
    }
}
