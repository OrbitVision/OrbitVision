using OrbitVision.API.Models;
using Microsoft.EntityFrameworkCore;

namespace OrbitVision.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Satellite>()
            .HasIndex(s => s.Name);
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Watchlist>()
            .HasOne(w => w.User)
            .WithMany(u => u.Watchlist)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Watchlist>()
            .HasOne(w => w.Satellite)
            .WithMany()
            .HasForeignKey(w => w.SatelliteId)
            .OnDelete(DeleteBehavior.Restrict);

    }

    public DbSet<Satellite> Satellites { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Watchlist> Watchlist { get; set; }
}