using System.ComponentModel.DataAnnotations;

namespace BuyNow.API.DTOs
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductImageUrl { get; set; }
        public decimal ProductPrice { get; set; }
        public decimal? ProductDiscountPrice { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
        public int AvailableStock { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class AddToCartRequest
    {
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class UpdateCartItemRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class CartSummaryDto
    {
        public List<CartItemDto> Items { get; set; } = new();
        public int TotalItems { get; set; }
        public decimal SubTotal { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }
}
