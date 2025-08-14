using Microsoft.EntityFrameworkCore;
using BuyNow.API.Models;

namespace BuyNow.API.Data
{
    public class BuyNowDbContext : DbContext
    {
        public BuyNowDbContext(DbContextOptions<BuyNowDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<AppConfig> AppConfigs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).HasMaxLength(255);
                entity.Property(e => e.Name).HasMaxLength(255);
                entity.Property(e => e.Role).HasMaxLength(50);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.Department).HasMaxLength(100);
            });

            // Category configuration
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(255);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
            });

            // Brand configuration
            modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.LogoUrl).HasMaxLength(500);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // Product configuration
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).HasMaxLength(255);
                entity.Property(e => e.Description).HasMaxLength(2000);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.DiscountPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Brand).HasMaxLength(100);
                entity.Property(e => e.Sku).HasMaxLength(100);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                entity.HasOne(e => e.Category)
                    .WithMany(c => c.Products)
                    .HasForeignKey(e => e.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.BrandEntity)
                    .WithMany(b => b.Products)
                    .HasForeignKey(e => e.BrandId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.CreatedBy)
                    .WithMany(u => u.CreatedProducts)
                    .HasForeignKey(e => e.CreatedById)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Order configuration
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.OrderNumber).HasMaxLength(50);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.PaymentId).HasMaxLength(255);
                entity.Property(e => e.PaymentStatus).HasMaxLength(50);
                entity.Property(e => e.ShippingName).HasMaxLength(255);
                entity.Property(e => e.ShippingAddress).HasMaxLength(500);
                entity.Property(e => e.ShippingAddress2).HasMaxLength(500);
                entity.Property(e => e.ShippingCity).HasMaxLength(100);
                entity.Property(e => e.ShippingState).HasMaxLength(100);
                entity.Property(e => e.ShippingZip).HasMaxLength(20);
                entity.Property(e => e.ShippingCountry).HasMaxLength(100);
                entity.Property(e => e.Notes).HasMaxLength(1000);

                entity.HasOne(e => e.User)
                    .WithMany(u => u.Orders)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // OrderItem configuration
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.UnitPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ProductName).HasMaxLength(255);
                entity.Property(e => e.ProductImageUrl).HasMaxLength(500);

                entity.HasOne(e => e.Order)
                    .WithMany(o => o.OrderItems)
                    .HasForeignKey(e => e.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                    .WithMany(p => p.OrderItems)
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // CartItem configuration
            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.UserId, e.ProductId }).IsUnique();

                entity.HasOne(e => e.User)
                    .WithMany(u => u.CartItems)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                    .WithMany(p => p.CartItems)
                    .HasForeignKey(e => e.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // AppConfig configuration
            modelBuilder.Entity<AppConfig>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Key).IsUnique();
                entity.Property(e => e.Key).HasMaxLength(100);
                entity.Property(e => e.Value).HasMaxLength(1000);
                entity.Property(e => e.Description).HasMaxLength(500);
            });
        }
    }
}
