namespace OrbitVision.API.Services;

public interface ISatelliteService
{
    Task<List<string>?> GetAllNamesAsync();
    Task<MultipleSatellitesResponse?> GetMultipleSatellitesAsync();
    Task<SatelliteRouteResponse?> GetSatelliteData();
}