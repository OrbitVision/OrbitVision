using OrbitVision.API.Data;
using OrbitVision.API.Models;
using Microsoft.EntityFrameworkCore;

namespace OrbitVision.API.Services;

public class WatchListService : IWatchListService
{
    AppDbContext _dbContext;
    public WatchListService(AppDbContext appDbContext)
    {
        _dbContext = appDbContext;
    }

    public async Task<bool> AddToWatchlist(int satelliteId, int userId)
    {
        try
        {
            var exists = await _dbContext.Watchlist
                .AnyAsync(w => w.UserId == userId && w.SatelliteId == satelliteId);

            if (exists)
            {
                return false; 
            }

            var watchlistItem = new Watchlist
            {
                UserId = userId,
                SatelliteId = satelliteId,
                AddedAt = DateTime.UtcNow
            };

            _dbContext.Watchlist.Add(watchlistItem);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<bool> DeleteFromWatchlist(int satelliteId, int userId)
    {
        try
        {
            var watchlistItem = await _dbContext.Watchlist
                .FirstOrDefaultAsync(w => w.UserId == userId && w.SatelliteId == satelliteId);

            if (watchlistItem == null)
            {
                return false; 
            }

            _dbContext.Watchlist.Remove(watchlistItem);
            await _dbContext.SaveChangesAsync();
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<List<AllSatelliteDataResponse>> GetAllUserSatellitesFromWatchlist(int userId)
    {
        try
        {
            var satellites = await _dbContext.Watchlist
                .Where(w => w.UserId == userId)
                .Include(w => w.Satellite)
                .Select(w => new AllSatelliteDataResponse(
                    w.Satellite.Id,
                    w.Satellite.Name,
                    w.Satellite.Line1,
                    w.Satellite.Line2,
                    w.Satellite.ExpDate
                ))
                .ToListAsync();
            
            return satellites;
        }
        catch (Exception)
        {
            return new List<AllSatelliteDataResponse>();
        }
    }
}