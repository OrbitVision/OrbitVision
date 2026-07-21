namespace OrbitVision.API.Models;

public class Watchlist
{
    public int Id { get; set; } 

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int SatelliteId { get; set; }
    public Satellite Satellite { get; set; } = null!;

    // Przydatny dodatek w tabeli łączącej
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}