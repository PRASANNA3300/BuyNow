using BuyNow.API.Models;
using BuyNow.API.DTOs;

namespace BuyNow.API.Services
{
    public interface IJwtService
    {
        TokenDto GenerateTokens(User user);
        int? ValidateToken(string token);
        string GenerateRefreshToken();
    }
}
