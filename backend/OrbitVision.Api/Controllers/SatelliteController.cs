using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrbitVision.Api.Domain;
using OrbitVision.API.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SattelliteControler : ControllerBase
{
    private readonly ISatelliteService _satelliteService;
    public SattelliteControler(ISatelliteService satelliteService)
    {
        _satelliteService = satelliteService;

    }

    // to complete - need to return info about the time when the satellite is visible, and the azimuth and elevation angles at that time also need to workd asynchronously
    // also need to move this from server to client
    [HttpGet("visible")]
    public async Task<IActionResult> Test()
    {
        var t = new CalculateVisible();
        t.CheckIfVisible("1 00694U 63047A   26183.75836606  .00001216  00000+0  13729-3 0  9994", "2 00694  30.3536 272.3159 0545772  14.8297 346.7644 14.12546036147908", 5.443132, -56.451715, 0);
        return Ok("Test completed");
    }

    [HttpGet]
    public async Task<SatelliteDataResponse?> GetDataAboutSatellite()
    {
        return await _satelliteService.GetSatelliteData();
    }

    [HttpGet("getThree")]
    public async Task<MultipleSatelliteDataResponse?> GetMultipleSatellites()
    {
        return await _satelliteService.GetMultipleSatellitesAsync();
    }

    [HttpGet("allSattellitesData")]
    public async Task<List<AllSatelliteDataResponse>?> getAllNames()
    {
        return await _satelliteService.GetAllSattellitesDataAsync();
    }



    [HttpGet("testClaims")]
    public string GetClaims()
    {
        var claim = User.Claims.FirstOrDefault(c => c.Type == "Email");
        if(claim == null)
        {
            return "Lipa";
        }
        else
        {
            return $"Claim: {claim.Value}";
        }
    }
}