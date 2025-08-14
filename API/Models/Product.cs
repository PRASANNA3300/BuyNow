using System.ComponentModel.DataAnnotations;

namespace BuyNow.API.Models
{
    public class Product
    {
        public int Id { get; set; }
        
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
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        [Required]
        public int CreatedById { get; set; }
        
        // Navigation properties
        public virtual Category Category { get; set; } = null!;
        public virtual Brand? BrandEntity { get; set; }
        public virtual User CreatedBy { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
