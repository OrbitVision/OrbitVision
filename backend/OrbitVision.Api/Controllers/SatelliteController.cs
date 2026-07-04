using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrbitVision.Api.Domain;
using OrbitVision.API.Data;
using OrbitVision.API.Models;
using OrbitVision.API.Services;
using SGPdotNET.TLE;

[ApiController]
[Route("api/[controller]")]
public class SattelliteControler : ControllerBase
{
    private readonly ISatelliteService _satelliteService;
    private readonly AppDbContext _db;
    private readonly HttpClient _httpClient;

    public SattelliteControler(ISatelliteService satelliteService, AppDbContext db, HttpClient httpClient)
    {
        _satelliteService = satelliteService;
        _db = db;
        _httpClient = httpClient;
    }

    // to complete - need to return info about the time when the satellite is visible, and the azimuth and elevation angles at that time also need to workd asynchronously
    [HttpGet("visible")]
    public async Task<IActionResult> Test()
    {
        var t = new CalculateVisible();
        t.CheckIfVisible("1 00694U 63047A   26183.75836606  .00001216  00000+0  13729-3 0  9994", "2 00694  30.3536 272.3159 0545772  14.8297 346.7644 14.12546036147908", 5.443132, -56.451715, 0);
        return Ok("Test completed");
    }

    // [HttpGet("sync")]
    // public async Task<IActionResult> SyncData()
    // {
    //     try
    //     {
    //         //var url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=TLE";
    //         var url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=TLE";

    //         _httpClient.DefaultRequestHeaders.UserAgent.Clear();
    //         _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");

    //         string rawData = await _httpClient.GetStringAsync(url);

    //         string[] lines = rawData.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries);
    //         var satellitesToInsert = new List<Satellite>();
    //         var now = DateTime.UtcNow;
    //         var expiration = now.AddHours(24);

    //         for (int i = 0; i <= lines.Length - 3; i += 3)
    //         {
    //             string name = lines[i].Trim();
    //             string line1 = lines[i + 1].Trim();
    //             string line2 = lines[i + 2].Trim();

    //             try
    //             {
    //                 var tleParser = new Tle(name, line1, line2);
    //                 int noradId = (int)tleParser.NoradNumber;

    //                 satellitesToInsert.Add(new Satellite
    //                 {
    //                     Id = noradId,
    //                     Name = name,
    //                     Line1 = line1,
    //                     Line2 = line2,
    //                     UpdatedAt = now,
    //                     ExpDate = expiration
    //                 });
    //             }
    //             catch
    //             {
    //                 continue;
    //             }
    //         }

    //         if (satellitesToInsert.Count > 0)
    //         {
    //             await _db.Satellites.ExecuteDeleteAsync();
    //             await _db.Satellites.AddRangeAsync(satellitesToInsert);
    //             await _db.SaveChangesAsync();

    //             return Ok($"Zsynchronizowano pomyślnie {satellitesToInsert.Count} satelitów.");
    //         }

    //         return BadRequest("Nie znaleziono żadnych danych do zapisu.");
    //     }
    //     catch (Exception ex)
    //     {
    //         return StatusCode(500, $"Błąd podczas synchronizacji: {ex.Message}");
    //     }
    // }

    [HttpGet]
    public async Task<SatelliteRouteResponse?> GetDataAboutSatellite()
    {
        return await _satelliteService.GetSatelliteData();
    }

    [HttpGet("getThree")]
    public async Task<MultipleSatellitesResponse?> GetMultipleSatellites()
    {
        return await _satelliteService.GetMultipleSatellitesAsync();
    }

    [HttpGet("allNames")]
    public async Task<List<string>?> getAllNames()
    {
        return await _satelliteService.GetAllNamesAsync();
    }
}