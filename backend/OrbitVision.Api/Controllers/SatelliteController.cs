using Microsoft.AspNetCore.Mvc;
using OrbitVision.API.Services;

[ApiController]
[Route("api/[controller]")]
public class SattelliteControler : ControllerBase
{
    private readonly SatelliteService _satelliteService;
    public SattelliteControler(SatelliteService satelliteService)
    {
        _satelliteService = satelliteService;
    }


    [HttpGet]
    public async Task<SatelliteRouteResponse?> GetDataAboutSatellite()
    {
        return await _satelliteService.GetSatelliteData();
    }
}