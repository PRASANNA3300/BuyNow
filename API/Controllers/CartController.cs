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
    public class CartController : ControllerBase
    {
        private readonly BuyNowDbContext _context;

        public CartController(BuyNowDbContext context)
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

        [HttpGet]
        public async Task<ActionResult<CartSummaryDto>> GetCart()
        {
            var userId = GetCurrentUserId();

            var cartItems = await _context.CartItems
                .Include(ci => ci.Product)
                .Where(ci => ci.UserId == userId)
                .Select(ci => new CartItemDto
                {
                    Id = ci.Id,
                    ProductId = ci.ProductId,
                    ProductName = ci.Product.Name,
                    ProductImageUrl = ci.Product.ImageUrl,
                    ProductPrice = ci.Product.Price,
                    ProductDiscountPrice = ci.Product.DiscountPrice,
                    Quantity = ci.Quantity,
                    TotalPrice = ci.Quantity * (ci.Product.DiscountPrice ?? ci.Product.Price),
                    AvailableStock = ci.Product.Stock,
                    CreatedAt = ci.CreatedAt,
                    UpdatedAt = ci.UpdatedAt
                })
                .ToListAsync();

            var subTotal = cartItems.Sum(item => item.TotalPrice);
            var tax = subTotal * 0.08m; // 8% tax rate - this should come from config
            var total = subTotal + tax;

            var cartSummary = new CartSummaryDto
            {
                Items = cartItems,
                TotalItems = cartItems.Sum(item => item.Quantity),
                SubTotal = subTotal,
                Tax = tax,
                Total = total
            };

            return Ok(cartSummary);
        }

        [HttpPost("items")]
        public async Task<ActionResult<CartItemDto>> AddToCart(AddToCartRequest request)
        {
            var userId = GetCurrentUserId();

            // Check if product exists and is active
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null || !product.IsActive)
            {
                return BadRequest(new { message = "Product not found or inactive" });
            }

            // Check stock availability
            if (product.Stock < request.Quantity)
            {
                return BadRequest(new { message = "Insufficient stock" });
            }

            // Check if item already exists in cart
            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == request.ProductId);

            if (existingCartItem != null)
            {
                // Update quantity
                var newQuantity = existingCartItem.Quantity + request.Quantity;
                if (product.Stock < newQuantity)
                {
                    return BadRequest(new { message = "Insufficient stock" });
                }

                existingCartItem.Quantity = newQuantity;
                existingCartItem.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var updatedCartItemDto = new CartItemDto
                {
                    Id = existingCartItem.Id,
                    ProductId = existingCartItem.ProductId,
                    ProductName = product.Name,
                    ProductImageUrl = product.ImageUrl,
                    ProductPrice = product.Price,
                    ProductDiscountPrice = product.DiscountPrice,
                    Quantity = existingCartItem.Quantity,
                    TotalPrice = existingCartItem.Quantity * (product.DiscountPrice ?? product.Price),
                    AvailableStock = product.Stock,
                    CreatedAt = existingCartItem.CreatedAt,
                    UpdatedAt = existingCartItem.UpdatedAt
                };

                return Ok(updatedCartItemDto);
            }
            else
            {
                // Create new cart item
                var cartItem = new CartItem
                {
                    UserId = userId,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.CartItems.Add(cartItem);
                await _context.SaveChangesAsync();

                var cartItemDto = new CartItemDto
                {
                    Id = cartItem.Id,
                    ProductId = cartItem.ProductId,
                    ProductName = product.Name,
                    ProductImageUrl = product.ImageUrl,
                    ProductPrice = product.Price,
                    ProductDiscountPrice = product.DiscountPrice,
                    Quantity = cartItem.Quantity,
                    TotalPrice = cartItem.Quantity * (product.DiscountPrice ?? product.Price),
                    AvailableStock = product.Stock,
                    CreatedAt = cartItem.CreatedAt,
                    UpdatedAt = cartItem.UpdatedAt
                };

                return CreatedAtAction(nameof(GetCart), cartItemDto);
            }
        }

        [HttpPut("items/{id}")]
        public async Task<ActionResult<CartItemDto>> UpdateCartItem(int id, UpdateCartItemRequest request)
        {
            var userId = GetCurrentUserId();

            var cartItem = await _context.CartItems
                .Include(ci => ci.Product)
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

            if (cartItem == null)
                return NotFound();

            // Check stock availability
            if (cartItem.Product.Stock < request.Quantity)
            {
                return BadRequest(new { message = "Insufficient stock" });
            }

            cartItem.Quantity = request.Quantity;
            cartItem.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var cartItemDto = new CartItemDto
            {
                Id = cartItem.Id,
                ProductId = cartItem.ProductId,
                ProductName = cartItem.Product.Name,
                ProductImageUrl = cartItem.Product.ImageUrl,
                ProductPrice = cartItem.Product.Price,
                ProductDiscountPrice = cartItem.Product.DiscountPrice,
                Quantity = cartItem.Quantity,
                TotalPrice = cartItem.Quantity * (cartItem.Product.DiscountPrice ?? cartItem.Product.Price),
                AvailableStock = cartItem.Product.Stock,
                CreatedAt = cartItem.CreatedAt,
                UpdatedAt = cartItem.UpdatedAt
            };

            return Ok(cartItemDto);
        }

        [HttpDelete("items/{id}")]
        public async Task<IActionResult> RemoveFromCart(int id)
        {
            var userId = GetCurrentUserId();

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.Id == id && ci.UserId == userId);

            if (cartItem == null)
                return NotFound();

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();

            var cartItems = await _context.CartItems
                .Where(ci => ci.UserId == userId)
                .ToListAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
