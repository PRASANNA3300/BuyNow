using System.ComponentModel.DataAnnotations;

namespace BuyNow.API.Models
{
    public class Order
    {
        public int Id { get; set; }
        
        [Required]
        public string OrderNumber { get; set; } = string.Empty;
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public decimal TotalAmount { get; set; }
        
        [Required]
        public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
        
        public string? PaymentId { get; set; } // PayPal payment ID
        public string? PaymentStatus { get; set; } // Pending, Completed, Failed
        
        // Shipping Address
        [Required]
        public string ShippingName { get; set; } = string.Empty;
        [Required]
        public string ShippingAddress { get; set; } = string.Empty;
        public string? ShippingAddress2 { get; set; }
        [Required]
        public string ShippingCity { get; set; } = string.Empty;
        [Required]
        public string ShippingState { get; set; } = string.Empty;
        [Required]
        public string ShippingZip { get; set; } = string.Empty;
        [Required]
        public string ShippingCountry { get; set; } = string.Empty;
        
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
