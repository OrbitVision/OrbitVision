using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrbitVision.API.Data;
using OrbitVision.API.Models;
using OrbitVision.API.Services;
using SGPdotNET.TLE; 

[ApiController]
[Route("api/[controller]")]
public class SattelliteControler : ControllerBase
{
    private readonly SatelliteService _satelliteService;
    private readonly AppDbContext _db;
    private readonly HttpClient _httpClient;
    public SattelliteControler(SatelliteService satelliteService, AppDbContext db, HttpClient httpClient)
    {
        _satelliteService = satelliteService;
        _db = db;
        _httpClient = httpClient;
    }

    //TESTOWA FUNKCJA
    [HttpGet("sync")] 
    public async Task<IActionResult> SyncData()
    {
        try
        {
            var url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=TLE";
            string rawData = await _httpClient.GetStringAsync(url);

            string[] lines = rawData.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries);

            var satellitesToInsert = new List<Satellite>();
            var now = DateTime.UtcNow;
            var expiration = now.AddHours(24);

            for (int i = 0; i <= lines.Length - 3; i += 3)
            {
                string name = lines[i].Trim();
                string line1 = lines[i + 1].Trim();
                string line2 = lines[i + 2].Trim();

                try
                {
                    var tleParser = new Tle(name, line1, line2);
                    int noradId = (int)tleParser.NoradNumber; 

                    satellitesToInsert.Add(new Satellite
                    {
                        Id = noradId,
                        Name = name,
                        Line1 = line1,
                        Line2 = line2,
                        UpdatedAt = now,
                        ExpDate = expiration
                    });
                }
                catch
                {
                    continue;
                }
            }

            if (satellitesToInsert.Count > 0)
            {
                await _db.Satellites.ExecuteDeleteAsync();
                await _db.Satellites.AddRangeAsync(satellitesToInsert);
                await _db.SaveChangesAsync();

                return Ok($"Zsynchronizowano pomyślnie {satellitesToInsert.Count} satelitów.");
            }

            return BadRequest("Nie znaleziono żadnych danych do zapisu.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Błąd podczas synchronizacji: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<SatelliteRouteResponse?> GetDataAboutSatellite()
    {
        return await _satelliteService.GetSatelliteData();
    }
}