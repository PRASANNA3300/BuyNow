using System.ComponentModel.DataAnnotations;

namespace BuyNow.API.DTOs
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? PaymentId { get; set; }
        public string? PaymentStatus { get; set; }
        public string ShippingName { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public string? ShippingAddress2 { get; set; }
        public string ShippingCity { get; set; } = string.Empty;
        public string ShippingState { get; set; } = string.Empty;
        public string ShippingZip { get; set; } = string.Empty;
        public string ShippingCountry { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductImageUrl { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class CreateOrderRequest
    {
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
        
        [Required]
        public string PaymentId { get; set; } = string.Empty; // PayPal payment ID
    }

    public class UpdateOrderStatusRequest
    {
        [Required]
        public string Status { get; set; } = string.Empty;
        
        public string? Notes { get; set; }
    }

    public class OrderFiltersRequest
    {
        public int? UserId { get; set; }
        public string? Status { get; set; }
        public string? PaymentStatus { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Search { get; set; } // Search by order number, user name, or email
        public string? SortBy { get; set; } = "created"; // created, total, status
        public string? SortOrder { get; set; } = "desc"; // asc, desc
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class OrderListResponse
    {
        public List<OrderDto> Orders { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
