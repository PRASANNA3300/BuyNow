using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using BuyNow.API.Data;
using BuyNow.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework
builder.Services.AddDbContext<BuyNowDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Register services
builder.Services.AddScoped<IJwtService, JwtService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite and CRA default ports
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BuyNow API", Version = "v1" });
    
    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BuyNowDbContext>();
    context.Database.EnsureCreated();

    // Seed data if database is empty
    SeedData(context).Wait();
}

app.Run();

static async Task SeedData(BuyNowDbContext context)
{
    // Check if data already exists
    if (await context.Users.AnyAsync())
        return;

    // Seed admin user
    var adminUser = new BuyNow.API.Models.User
    {
        Email = "admin@buynow.com",
        Name = "Admin User",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
        Role = "Admin",
        IsActive = true,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    context.Users.Add(adminUser);
    await context.SaveChangesAsync();

    // Seed categories
    var categories = new[]
    {
        new BuyNow.API.Models.Category { Name = "Electronics", Description = "Electronic devices and gadgets", IsActive = true, SortOrder = 1 },
        new BuyNow.API.Models.Category { Name = "Clothing", Description = "Fashion and apparel", IsActive = true, SortOrder = 2 },
        new BuyNow.API.Models.Category { Name = "Home & Garden", Description = "Home improvement and garden supplies", IsActive = true, SortOrder = 3 },
        new BuyNow.API.Models.Category { Name = "Sports & Outdoors", Description = "Sports equipment and outdoor gear", IsActive = true, SortOrder = 4 },
        new BuyNow.API.Models.Category { Name = "Books", Description = "Books and educational materials", IsActive = true, SortOrder = 5 }
    };

    context.Categories.AddRange(categories);
    await context.SaveChangesAsync();

    // Seed brands
    var brands = new[]
    {
        new BuyNow.API.Models.Brand { Name = "TechSound", Description = "Premium audio equipment", IsActive = true, SortOrder = 1 },
        new BuyNow.API.Models.Brand { Name = "SmartTech", Description = "Smart devices and wearables", IsActive = true, SortOrder = 2 },
        new BuyNow.API.Models.Brand { Name = "StreamCam", Description = "Professional streaming equipment", IsActive = true, SortOrder = 3 },
        new BuyNow.API.Models.Brand { Name = "FashionForward", Description = "Modern fashion and apparel", IsActive = true, SortOrder = 4 },
        new BuyNow.API.Models.Brand { Name = "HomeComfort", Description = "Home and garden essentials", IsActive = true, SortOrder = 5 },
        new BuyNow.API.Models.Brand { Name = "SportsPro", Description = "Professional sports equipment", IsActive = true, SortOrder = 6 },
        new BuyNow.API.Models.Brand { Name = "BookWise", Description = "Educational and entertainment books", IsActive = true, SortOrder = 7 },
        new BuyNow.API.Models.Brand { Name = "CookMaster", Description = "Kitchen and cooking essentials", IsActive = true, SortOrder = 8 }
    };

    context.Brands.AddRange(brands);
    await context.SaveChangesAsync();

    // Seed app configuration
    var configs = new[]
    {
        new BuyNow.API.Models.AppConfig { Key = "currency", Value = "USD", Description = "Default currency" },
        new BuyNow.API.Models.AppConfig { Key = "tax_rate", Value = "0.08", Description = "Tax rate (8%)" },
        new BuyNow.API.Models.AppConfig { Key = "max_cart_items", Value = "50", Description = "Maximum items in cart" },
        new BuyNow.API.Models.AppConfig { Key = "site_name", Value = "BuyNow", Description = "Site name" },
        new BuyNow.API.Models.AppConfig { Key = "support_email", Value = "support@buynow.com", Description = "Support email" }
    };

    context.AppConfigs.AddRange(configs);
    await context.SaveChangesAsync();

    // Seed products
    var products = new[]
    {
        // Electronics
        new BuyNow.API.Models.Product { Name = "Wireless Bluetooth Headphones", Description = "High-quality wireless headphones with noise cancellation", Price = 199.99m, CategoryId = 1, Brand = "TechSound", Stock = 50, ImageUrl = "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, IsFeatured = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Smart Watch Pro", Description = "Feature-rich smartwatch with health monitoring", Price = 299.99m, CategoryId = 1, Brand = "SmartTech", Stock = 25, ImageUrl = "https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, IsFeatured = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "4K Webcam", Description = "Ultra HD webcam for streaming and video calls", Price = 89.99m, CategoryId = 1, Brand = "StreamCam", Stock = 30, ImageUrl = "https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Wireless Charging Pad", Description = "Fast wireless charging for compatible devices", Price = 39.99m, CategoryId = 1, Brand = "ChargeFast", Stock = 75, ImageUrl = "https://images.pexels.com/photos/4219654/pexels-photo-4219654.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Bluetooth Speaker", Description = "Portable waterproof Bluetooth speaker", Price = 79.99m, CategoryId = 1, Brand = "SoundWave", Stock = 40, ImageUrl = "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },

        // Clothing
        new BuyNow.API.Models.Product { Name = "Classic Denim Jacket", Description = "Timeless denim jacket for casual wear", Price = 89.99m, CategoryId = 2, Brand = "DenimCo", Stock = 60, ImageUrl = "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, IsFeatured = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Cotton T-Shirt Pack", Description = "Pack of 3 premium cotton t-shirts", Price = 49.99m, CategoryId = 2, Brand = "ComfortWear", Stock = 100, ImageUrl = "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Winter Wool Sweater", Description = "Warm and cozy wool sweater for winter", Price = 129.99m, CategoryId = 2, Brand = "WoolCraft", Stock = 35, ImageUrl = "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Casual Sneakers", Description = "Comfortable sneakers for everyday wear", Price = 119.99m, CategoryId = 2, Brand = "StepComfort", Stock = 80, ImageUrl = "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },

        // Home & Garden
        new BuyNow.API.Models.Product { Name = "Coffee Maker Deluxe", Description = "Automatic coffee maker with programmable settings", Price = 149.99m, CategoryId = 3, Brand = "BrewMaster", Stock = 30, ImageUrl = "https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, IsFeatured = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "LED Desk Lamp", Description = "Adjustable LED desk lamp with USB charging", Price = 45.99m, CategoryId = 3, Brand = "BrightLight", Stock = 55, ImageUrl = "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Indoor Plant Set", Description = "Set of 3 low-maintenance indoor plants", Price = 69.99m, CategoryId = 3, Brand = "GreenThumb", Stock = 25, ImageUrl = "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Kitchen Knife Set", Description = "Professional 8-piece kitchen knife set", Price = 199.99m, CategoryId = 3, Brand = "ChefPro", Stock = 20, ImageUrl = "https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },

        // Sports & Outdoors
        new BuyNow.API.Models.Product { Name = "Yoga Mat Premium", Description = "Non-slip premium yoga mat with carrying strap", Price = 59.99m, CategoryId = 4, Brand = "YogaFlow", Stock = 45, ImageUrl = "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Running Shoes Pro", Description = "Professional running shoes with advanced cushioning", Price = 159.99m, CategoryId = 4, Brand = "RunFast", Stock = 65, ImageUrl = "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, IsFeatured = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Camping Tent 4-Person", Description = "Waterproof 4-person camping tent", Price = 249.99m, CategoryId = 4, Brand = "OutdoorGear", Stock = 15, ImageUrl = "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Fitness Resistance Bands", Description = "Set of 5 resistance bands for home workouts", Price = 29.99m, CategoryId = 4, Brand = "FitStrong", Stock = 90, ImageUrl = "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },

        // Books
        new BuyNow.API.Models.Product { Name = "Programming Fundamentals", Description = "Complete guide to programming fundamentals", Price = 49.99m, CategoryId = 5, Brand = "TechBooks", Stock = 40, ImageUrl = "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Digital Marketing Guide", Description = "Comprehensive digital marketing strategies", Price = 39.99m, CategoryId = 5, Brand = "MarketPro", Stock = 35, ImageUrl = "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id },
        new BuyNow.API.Models.Product { Name = "Cookbook Collection", Description = "Collection of international recipes", Price = 34.99m, CategoryId = 5, Brand = "CookMaster", Stock = 50, ImageUrl = "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400", IsActive = true, CreatedById = adminUser.Id }
    };

    context.Products.AddRange(products);
    await context.SaveChangesAsync();
}
