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
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly BuyNowDbContext _context;

        public OrdersController(BuyNowDbContext context)
        {
            _context = context;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException();
            }
            return userId;
        }

        private bool IsAdmin()
        {
            return User.IsInRole("Admin");
        }

        [HttpGet]
        public async Task<ActionResult<OrderListResponse>> GetOrders([FromQuery] OrderFiltersRequest filters)
        {
            var userId = GetCurrentUserId();
            var isAdmin = IsAdmin();

            var query = _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .AsQueryable();

            // Non-admin users can only see their own orders
            if (!isAdmin)
            {
                query = query.Where(o => o.UserId == userId);
            }
            else if (filters.UserId.HasValue)
            {
                query = query.Where(o => o.UserId == filters.UserId.Value);
            }

            // Apply filters
            if (!string.IsNullOrEmpty(filters.Status))
                query = query.Where(o => o.Status == filters.Status);

            if (!string.IsNullOrEmpty(filters.PaymentStatus))
                query = query.Where(o => o.PaymentStatus == filters.PaymentStatus);

            if (filters.FromDate.HasValue)
                query = query.Where(o => o.CreatedAt >= filters.FromDate.Value);

            if (filters.ToDate.HasValue)
                query = query.Where(o => o.CreatedAt <= filters.ToDate.Value);

            if (!string.IsNullOrEmpty(filters.Search))
            {
                var searchTerm = filters.Search.ToLower();
                query = query.Where(o => 
                    o.OrderNumber.ToLower().Contains(searchTerm) ||
                    o.User.Name.ToLower().Contains(searchTerm) ||
                    o.User.Email.ToLower().Contains(searchTerm));
            }

            // Apply sorting
            query = filters.SortBy?.ToLower() switch
            {
                "total" => filters.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(o => o.TotalAmount)
                    : query.OrderByDescending(o => o.TotalAmount),
                "status" => filters.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(o => o.Status)
                    : query.OrderByDescending(o => o.Status),
                _ => filters.SortOrder?.ToLower() == "asc"
                    ? query.OrderBy(o => o.CreatedAt)
                    : query.OrderByDescending(o => o.CreatedAt)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / filters.PageSize);

            var orders = await query
                .Skip((filters.Page - 1) * filters.PageSize)
                .Take(filters.PageSize)
                .Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    UserId = o.UserId,
                    UserName = o.User.Name,
                    UserEmail = o.User.Email,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    PaymentId = o.PaymentId,
                    PaymentStatus = o.PaymentStatus,
                    ShippingName = o.ShippingName,
                    ShippingAddress = o.ShippingAddress,
                    ShippingAddress2 = o.ShippingAddress2,
                    ShippingCity = o.ShippingCity,
                    ShippingState = o.ShippingState,
                    ShippingZip = o.ShippingZip,
                    ShippingCountry = o.ShippingCountry,
                    Notes = o.Notes,
                    CreatedAt = o.CreatedAt,
                    UpdatedAt = o.UpdatedAt,
                    OrderItems = o.OrderItems.Select(oi => new OrderItemDto
                    {
                        Id = oi.Id,
                        ProductId = oi.ProductId,
                        ProductName = oi.ProductName,
                        ProductImageUrl = oi.ProductImageUrl,
                        Quantity = oi.Quantity,
                        UnitPrice = oi.UnitPrice,
                        TotalPrice = oi.TotalPrice
                    }).ToList()
                })
                .ToListAsync();

            return Ok(new OrderListResponse
            {
                Orders = orders,
                TotalCount = totalCount,
                Page = filters.Page,
                PageSize = filters.PageSize,
                TotalPages = totalPages
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var userId = GetCurrentUserId();
            var isAdmin = IsAdmin();

            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            // Non-admin users can only see their own orders
            if (!isAdmin && order.UserId != userId)
                return Forbid();

            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                UserName = order.User.Name,
                UserEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentId = order.PaymentId,
                PaymentStatus = order.PaymentStatus,
                ShippingName = order.ShippingName,
                ShippingAddress = order.ShippingAddress,
                ShippingAddress2 = order.ShippingAddress2,
                ShippingCity = order.ShippingCity,
                ShippingState = order.ShippingState,
                ShippingZip = order.ShippingZip,
                ShippingCountry = order.ShippingCountry,
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductImageUrl = oi.ProductImageUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };

            return Ok(orderDto);
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder(CreateOrderRequest request)
        {
            var userId = GetCurrentUserId();

            // Get user's cart items
            var cartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
            {
                return BadRequest(new { message = "Cart is empty" });
            }

            // Validate stock availability
            foreach (var cartItem in cartItems)
            {
                if (cartItem.Product.Stock < cartItem.Quantity)
                {
                    return BadRequest(new { message = $"Insufficient stock for {cartItem.Product.Name}" });
                }
            }

            // Calculate total
            var subTotal = cartItems.Sum(ci => ci.Quantity * (ci.Product.DiscountPrice ?? ci.Product.Price));
            var tax = subTotal * 0.08m; // 8% tax rate - should come from config
            var total = subTotal + tax;

            // Generate order number
            var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";

            // Create order
            var order = new Order
            {
                OrderNumber = orderNumber,
                UserId = userId,
                TotalAmount = total,
                Status = "Pending",
                PaymentId = request.PaymentId,
                PaymentStatus = "Completed", // Assuming PayPal payment is completed
                ShippingName = request.ShippingName,
                ShippingAddress = request.ShippingAddress,
                ShippingAddress2 = request.ShippingAddress2,
                ShippingCity = request.ShippingCity,
                ShippingState = request.ShippingState,
                ShippingZip = request.ShippingZip,
                ShippingCountry = request.ShippingCountry,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Create order items and update stock
            foreach (var cartItem in cartItems)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.Product.DiscountPrice ?? cartItem.Product.Price,
                    TotalPrice = cartItem.Quantity * (cartItem.Product.DiscountPrice ?? cartItem.Product.Price),
                    ProductName = cartItem.Product.Name,
                    ProductImageUrl = cartItem.Product.ImageUrl
                };

                _context.OrderItems.Add(orderItem);

                // Update product stock
                cartItem.Product.Stock -= cartItem.Quantity;
                cartItem.Product.UpdatedAt = DateTime.UtcNow;
            }

            // Clear cart
            _context.CartItems.RemoveRange(cartItems);

            await _context.SaveChangesAsync();

            // Load the created order with related data
            var createdOrder = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .FirstAsync(o => o.Id == order.Id);

            var orderDto = new OrderDto
            {
                Id = createdOrder.Id,
                OrderNumber = createdOrder.OrderNumber,
                UserId = createdOrder.UserId,
                UserName = createdOrder.User.Name,
                UserEmail = createdOrder.User.Email,
                TotalAmount = createdOrder.TotalAmount,
                Status = createdOrder.Status,
                PaymentId = createdOrder.PaymentId,
                PaymentStatus = createdOrder.PaymentStatus,
                ShippingName = createdOrder.ShippingName,
                ShippingAddress = createdOrder.ShippingAddress,
                ShippingAddress2 = createdOrder.ShippingAddress2,
                ShippingCity = createdOrder.ShippingCity,
                ShippingState = createdOrder.ShippingState,
                ShippingZip = createdOrder.ShippingZip,
                ShippingCountry = createdOrder.ShippingCountry,
                Notes = createdOrder.Notes,
                CreatedAt = createdOrder.CreatedAt,
                UpdatedAt = createdOrder.UpdatedAt,
                OrderItems = createdOrder.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductImageUrl = oi.ProductImageUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, orderDto);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrderDto>> UpdateOrderStatus(int id, UpdateOrderStatusRequest request)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            order.Status = request.Status;
            if (!string.IsNullOrEmpty(request.Notes))
            {
                order.Notes = request.Notes;
            }
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderNumber = order.OrderNumber,
                UserId = order.UserId,
                UserName = order.User.Name,
                UserEmail = order.User.Email,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                PaymentId = order.PaymentId,
                PaymentStatus = order.PaymentStatus,
                ShippingName = order.ShippingName,
                ShippingAddress = order.ShippingAddress,
                ShippingAddress2 = order.ShippingAddress2,
                ShippingCity = order.ShippingCity,
                ShippingState = order.ShippingState,
                ShippingZip = order.ShippingZip,
                ShippingCountry = order.ShippingCountry,
                Notes = order.Notes,
                CreatedAt = order.CreatedAt,
                UpdatedAt = order.UpdatedAt,
                OrderItems = order.OrderItems.Select(oi => new OrderItemDto
                {
                    Id = oi.Id,
                    ProductId = oi.ProductId,
                    ProductName = oi.ProductName,
                    ProductImageUrl = oi.ProductImageUrl,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };

            return Ok(orderDto);
        }
    }
}
