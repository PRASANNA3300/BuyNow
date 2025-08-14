using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BuyNow.API.Data;
using BuyNow.API.Models;
using BuyNow.API.DTOs;

namespace BuyNow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly BuyNowDbContext _context;

        public BrandsController(BuyNowDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<BrandDto>>> GetBrands()
        {
            var brands = await _context.Brands
                .Where(b => b.IsActive)
                .OrderBy(b => b.SortOrder)
                .ThenBy(b => b.Name)
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Description = b.Description,
                    LogoUrl = b.LogoUrl,
                    IsActive = b.IsActive,
                    SortOrder = b.SortOrder,
                    ProductCount = b.Products.Count(p => p.IsActive),
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .ToListAsync();

            return Ok(brands);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<BrandDto>>> GetAllBrands()
        {
            var brands = await _context.Brands
                .OrderBy(b => b.SortOrder)
                .ThenBy(b => b.Name)
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Description = b.Description,
                    LogoUrl = b.LogoUrl,
                    IsActive = b.IsActive,
                    SortOrder = b.SortOrder,
                    ProductCount = b.Products.Count(p => p.IsActive),
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .ToListAsync();

            return Ok(brands);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BrandDto>> GetBrand(int id)
        {
            var brand = await _context.Brands
                .Where(b => b.Id == id)
                .Select(b => new BrandDto
                {
                    Id = b.Id,
                    Name = b.Name,
                    Description = b.Description,
                    LogoUrl = b.LogoUrl,
                    IsActive = b.IsActive,
                    SortOrder = b.SortOrder,
                    ProductCount = b.Products.Count(p => p.IsActive),
                    CreatedAt = b.CreatedAt,
                    UpdatedAt = b.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (brand == null)
                return NotFound();

            return Ok(brand);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BrandDto>> CreateBrand(CreateBrandRequest request)
        {
            var brand = new Brand
            {
                Name = request.Name,
                Description = request.Description,
                LogoUrl = request.LogoUrl,
                IsActive = request.IsActive,
                SortOrder = request.SortOrder,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            var brandDto = new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Description = brand.Description,
                LogoUrl = brand.LogoUrl,
                IsActive = brand.IsActive,
                SortOrder = brand.SortOrder,
                ProductCount = 0,
                CreatedAt = brand.CreatedAt,
                UpdatedAt = brand.UpdatedAt
            };

            return CreatedAtAction(nameof(GetBrand), new { id = brand.Id }, brandDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<BrandDto>> UpdateBrand(int id, UpdateBrandRequest request)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            brand.Name = request.Name;
            brand.Description = request.Description;
            brand.LogoUrl = request.LogoUrl;
            brand.IsActive = request.IsActive;
            brand.SortOrder = request.SortOrder;
            brand.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var brandDto = new BrandDto
            {
                Id = brand.Id,
                Name = brand.Name,
                Description = brand.Description,
                LogoUrl = brand.LogoUrl,
                IsActive = brand.IsActive,
                SortOrder = brand.SortOrder,
                ProductCount = await _context.Products.CountAsync(p => p.Brand == brand.Name && p.IsActive),
                CreatedAt = brand.CreatedAt,
                UpdatedAt = brand.UpdatedAt
            };

            return Ok(brandDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            // Check if brand is used by any products
            var hasProducts = await _context.Products.AnyAsync(p => p.Brand == brand.Name);
            if (hasProducts)
            {
                return BadRequest(new { message = "Cannot delete brand that is used by products" });
            }

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
