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
    public async Task<string> GetData()
    {
        return await _satelliteService.GetSatelliteData();
    }
}