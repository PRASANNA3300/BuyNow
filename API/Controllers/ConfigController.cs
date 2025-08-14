using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using BuyNow.API.Data;
using BuyNow.API.Models;

namespace BuyNow.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfigController : ControllerBase
    {
        private readonly BuyNowDbContext _context;

        public ConfigController(BuyNowDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Dictionary<string, string>>> GetConfig()
        {
            var configs = await _context.AppConfigs
                .ToDictionaryAsync(c => c.Key, c => c.Value);

            return Ok(configs);
        }

        [HttpGet("{key}")]
        public async Task<ActionResult<string>> GetConfigValue(string key)
        {
            var config = await _context.AppConfigs
                .FirstOrDefaultAsync(c => c.Key == key);

            if (config == null)
                return NotFound();

            return Ok(config.Value);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SetConfig([FromBody] Dictionary<string, string> configs)
        {
            foreach (var kvp in configs)
            {
                var existingConfig = await _context.AppConfigs
                    .FirstOrDefaultAsync(c => c.Key == kvp.Key);

                if (existingConfig != null)
                {
                    existingConfig.Value = kvp.Value;
                    existingConfig.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    _context.AppConfigs.Add(new AppConfig
                    {
                        Key = kvp.Key,
                        Value = kvp.Value,
                        UpdatedAt = DateTime.UtcNow
                    });
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{key}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateConfig(string key, [FromBody] string value)
        {
            var config = await _context.AppConfigs
                .FirstOrDefaultAsync(c => c.Key == key);

            if (config == null)
            {
                _context.AppConfigs.Add(new AppConfig
                {
                    Key = key,
                    Value = value,
                    UpdatedAt = DateTime.UtcNow
                });
            }
            else
            {
                config.Value = value;
                config.UpdatedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{key}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteConfig(string key)
        {
            var config = await _context.AppConfigs
                .FirstOrDefaultAsync(c => c.Key == key);

            if (config == null)
                return NotFound();

            _context.AppConfigs.Remove(config);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
