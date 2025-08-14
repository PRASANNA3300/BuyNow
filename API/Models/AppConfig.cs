using System.ComponentModel.DataAnnotations;

namespace BuyNow.API.Models
{
    public class AppConfig
    {
        public int Id { get; set; }
        
        [Required]
        public string Key { get; set; } = string.Empty;
        
        [Required]
        public string Value { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
