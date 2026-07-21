namespace OrbitVision.API.Services;

public interface IWatchListService
{
    Task<bool> AddToWatchlist(int satelliteId, int userId);
    Task<bool> DeleteFromWatchlist(int satelliteId, int userId);
    Task<List<AllSatelliteDataResponse>> GetAllUserSatellitesFromWatchlist(int userId);
}