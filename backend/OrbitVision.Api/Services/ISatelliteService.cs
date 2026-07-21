namespace OrbitVision.API.Services;

public interface ISatelliteService
{
    Task<List<AllSatelliteDataResponse>?> GetAllSattellitesDataAsync();
    Task<MultipleSatelliteDataResponse?> GetMultipleSatellitesAsync();
    Task<SatelliteDataResponse?> GetSatelliteData();
}