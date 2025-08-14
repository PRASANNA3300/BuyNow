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
    public class ProductsController : ControllerBase
    {
        private readonly BuyNowDbContext _context;

        public ProductsController(BuyNowDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ProductListResponse>> GetProducts([FromQuery] ProductFiltersRequest filters)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .Include(p => p.CreatedBy)
                .AsQueryable();

            // Apply filters
            if (filters.CategoryId.HasValue)
                query = query.Where(p => p.CategoryId == filters.CategoryId.Value);

            if (!string.IsNullOrEmpty(filters.Brand))
                query = query.Where(p => p.Brand != null && p.Brand.Contains(filters.Brand));

            if (filters.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filters.MinPrice.Value);

            if (filters.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filters.MaxPrice.Value);

            if (filters.IsActive.HasValue)
                query = query.Where(p => p.IsActive == filters.IsActive.Value);

            if (filters.IsFeatured.HasValue)
                query = query.Where(p => p.IsFeatured == filters.IsFeatured.Value);

            if (!string.IsNullOrEmpty(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(p => 
                    p.Name.ToLower().Contains(searchTerm) ||
                    (p.Description != null && p.Description.ToLower().Contains(searchTerm)) ||
                    (p.Brand != null && p.Brand.ToLower().Contains(searchTerm)));
            }

            // Apply sorting
            query = filters.SortBy?.ToLower() switch
            {
                "name" => filters.SortOrder?.ToLower() == "desc" 
                    ? query.OrderByDescending(p => p.Name)
                    : query.OrderBy(p => p.Name),
                "price" => filters.SortOrder?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Price)
                    : query.OrderBy(p => p.Price),
                "created" => filters.SortOrder?.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.CreatedAt)
                    : query.OrderBy(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / filters.PageSize);

            var products = await query
                .Skip((filters.Page - 1) * filters.PageSize)
                .Take(filters.PageSize)
                .Select(p => new ProductDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Price = p.Price,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name,
                    Brand = p.Brand,
                    BrandId = p.BrandId,
                    Sku = p.Sku,
                    Stock = p.Stock,
                    ImageUrl = p.ImageUrl,
                    IsActive = p.IsActive,
                    IsFeatured = p.IsFeatured,
                    DiscountPrice = p.DiscountPrice,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    CreatedById = p.CreatedById,
                    CreatedByName = p.CreatedBy.Name
                })
                .ToListAsync();

            return Ok(new ProductListResponse
            {
                Products = products,
                TotalCount = totalCount,
                Page = filters.Page,
                PageSize = filters.PageSize,
                TotalPages = totalPages
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.CreatedBy)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                Brand = product.Brand,
                BrandId = product.BrandId,
                Sku = product.Sku,
                Stock = product.Stock,
                ImageUrl = product.ImageUrl,
                IsActive = product.IsActive,
                IsFeatured = product.IsFeatured,
                DiscountPrice = product.DiscountPrice,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                CreatedById = product.CreatedById,
                CreatedByName = product.CreatedBy.Name
            };

            return Ok(productDto);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductRequest request)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized();
            }

            // Validate category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Category not found" });
            }

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                CategoryId = request.CategoryId,
                Brand = request.Brand,
                BrandId = request.BrandId,
                Sku = request.Sku,
                Stock = request.Stock,
                ImageUrl = request.ImageUrl,
                IsActive = request.IsActive,
                IsFeatured = request.IsFeatured,
                DiscountPrice = request.DiscountPrice,
                CreatedById = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // Load the created product with related data
            var createdProduct = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.CreatedBy)
                .FirstAsync(p => p.Id == product.Id);

            var productDto = new ProductDto
            {
                Id = createdProduct.Id,
                Name = createdProduct.Name,
                Description = createdProduct.Description,
                Price = createdProduct.Price,
                CategoryId = createdProduct.CategoryId,
                CategoryName = createdProduct.Category.Name,
                Brand = createdProduct.Brand,
                BrandId = createdProduct.BrandId,
                Sku = createdProduct.Sku,
                Stock = createdProduct.Stock,
                ImageUrl = createdProduct.ImageUrl,
                IsActive = createdProduct.IsActive,
                IsFeatured = createdProduct.IsFeatured,
                DiscountPrice = createdProduct.DiscountPrice,
                CreatedAt = createdProduct.CreatedAt,
                UpdatedAt = createdProduct.UpdatedAt,
                CreatedById = createdProduct.CreatedById,
                CreatedByName = createdProduct.CreatedBy.Name
            };

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(int id, UpdateProductRequest request)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.CreatedBy)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            // Validate category exists
            var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
            if (!categoryExists)
            {
                return BadRequest(new { message = "Category not found" });
            }

            product.Name = request.Name;
            product.Description = request.Description;
            product.Price = request.Price;
            product.CategoryId = request.CategoryId;
            product.Brand = request.Brand;
            product.BrandId = request.BrandId;
            product.Sku = request.Sku;
            product.Stock = request.Stock;
            product.ImageUrl = request.ImageUrl;
            product.IsActive = request.IsActive;
            product.IsFeatured = request.IsFeatured;
            product.DiscountPrice = request.DiscountPrice;
            product.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            // Reload to get updated category name
            await _context.Entry(product).Reference(p => p.Category).LoadAsync();

            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId,
                CategoryName = product.Category.Name,
                Brand = product.Brand,
                BrandId = product.BrandId,
                Sku = product.Sku,
                Stock = product.Stock,
                ImageUrl = product.ImageUrl,
                IsActive = product.IsActive,
                IsFeatured = product.IsFeatured,
                DiscountPrice = product.DiscountPrice,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,
                CreatedById = product.CreatedById,
                CreatedByName = product.CreatedBy.Name
            };

            return Ok(productDto);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
                return NotFound();

            // Check if product has orders
            var hasOrders = await _context.OrderItems.AnyAsync(oi => oi.ProductId == id);
            if (hasOrders)
            {
                return BadRequest(new { message = "Cannot delete product that has been ordered" });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
