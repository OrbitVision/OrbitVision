namespace OrbitVision.API.Models;

public class Satellite
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Line1 { get; set; } = string.Empty;
    public string Line2 { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
    public DateTime ExpDate { get; set; }
}