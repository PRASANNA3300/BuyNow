using System.ComponentModel.DataAnnotations;

namespace BuyNow.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string? Brand { get; set; }
        public int? BrandId { get; set; }
        public string? Sku { get; set; }
        public int Stock { get; set; }
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public decimal? DiscountPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int CreatedById { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
    }

    public class CreateProductRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        public string? Brand { get; set; }
        public int? BrandId { get; set; }
        public string? Sku { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        public bool IsFeatured { get; set; } = false;
        public decimal? DiscountPrice { get; set; }
    }

    public class UpdateProductRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        [Required]
        public int CategoryId { get; set; }
        
        public string? Brand { get; set; }
        public int? BrandId { get; set; }
        public string? Sku { get; set; }
        
        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; }
        public bool IsFeatured { get; set; }
        public decimal? DiscountPrice { get; set; }
    }

    public class ProductFiltersRequest
    {
        public int? CategoryId { get; set; }
        public string? Brand { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsFeatured { get; set; }
        public string? Search { get; set; }
        public string? SortBy { get; set; } // name, price, created
        public string? SortOrder { get; set; } // asc, desc
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class ProductListResponse
    {
        public List<ProductDto> Products { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
