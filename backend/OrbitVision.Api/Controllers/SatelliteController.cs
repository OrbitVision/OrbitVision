using Microsoft.AspNetCore.Mvc;
using OrbitVision.API.Services;
using SGPdotNET.CoordinateSystem;

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
    public async Task<SatelliteRouteResponse?> GetData()
    {
        return await _satelliteService.GetSatelliteData();
    }
}