using System.ComponentModel.DataAnnotations;

namespace BuyNow.API.DTOs
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsActive { get; set; }
        public int SortOrder { get; set; }
        public int ProductCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateBrandRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(500)]
        public string? LogoUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;
    }

    public class UpdateBrandRequest
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(500)]
        public string? LogoUrl { get; set; }
        
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;
    }
}
