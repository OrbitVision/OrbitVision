using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrbitVision.API.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WatchlistController : ControllerBase
{
    private readonly IWatchListService _watchlistService;

    public WatchlistController(IWatchListService watchlistService)
    {
        _watchlistService = watchlistService;
    }


    [HttpGet]
    public async Task<IActionResult> GetUserWatchlist()
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized("Nie udało się zidentyfikować użytkownika z tokena.");
        }

        var satellites = await _watchlistService.GetAllUserSatellitesFromWatchlist(userId.Value);
        return Ok(satellites);
    }


    [HttpPost("{satelliteId}")]
    public async Task<IActionResult> AddToWatchlist(int satelliteId)
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized("Nie udało się zidentyfikować użytkownika z tokena.");
        }

        var success = await _watchlistService.AddToWatchlist(satelliteId, userId.Value);
        if (!success)
        {
            return BadRequest(new { message = "Nie udało się dodać satelity do watchlisty (może już tam jest)." });
        }

        return Ok(new { message = "Satelita został pomyślnie dodany do watchlisty." });
    }


    [HttpDelete("{satelliteId}")]
    public async Task<IActionResult> DeleteFromWatchlist(int satelliteId)
    {
        var userId = GetUserIdFromClaims();
        if (userId == null)
        {
            return Unauthorized("Nie udało się zidentyfikować użytkownika z tokena.");
        }

        var success = await _watchlistService.DeleteFromWatchlist(satelliteId, userId.Value);
        if (!success)
        {
            return NotFound(new { message = "Nie znaleziono takiego satelity na watchliście użytkownika." });
        }

        return Ok(new { message = "Satelita został usunięty z watchlisty." });
    }


    private int? GetUserIdFromClaims()
    {
        var claim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
        if (claim != null && int.TryParse(claim.Value, out var userId))
        {
            return userId;
        }
        return null;
    }
}