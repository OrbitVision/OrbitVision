namespace OrbitVision.API.Services;

public interface ISatelliteService
{
    Task<List<string>?> GetAllNamesAsync();
    Task<MultipleSatelliteDataResponse?> GetMultipleSatellitesAsync();
    Task<SatelliteDataResponse?> GetSatelliteData();
}