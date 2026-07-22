using Microsoft.EntityFrameworkCore;
using OrbitVision.Api.Services;
using OrbitVision.API.Data;
using OrbitVision.API.Domain;
using SGPdotNET.CoordinateSystem; // Contains EciCoordinate / GeodeticCoordinate
using SGPdotNET.Propagation;      // Matches your docs: Sgp4, FindPosition
using SGPdotNET.TLE;              // Contains Tle

namespace OrbitVision.API.Services;

public class TleEntry
{
    public string Name { get; set; } = "";
    public string Line1 { get; set; } = "";
    public string Line2 { get; set; } = "";
}

public class SatelliteService : ISatelliteService
{
    private readonly AppDbContext _dbContext;
    private readonly OrbitCalculator _orbitCalculator;
    private readonly ISatelliteRefreshService _satelliteRefreshService;
    public SatelliteService(AppDbContext dbContext, OrbitCalculator orbitCalculator, ISatelliteRefreshService satelliteRefreshService)
    {
        _dbContext = dbContext;
        _orbitCalculator = orbitCalculator;
        _satelliteRefreshService = satelliteRefreshService;
    }


    private async Task CheckForRefresh()
    {
        var expDate = await _dbContext.Satellites.Select(s => s.ExpDate).FirstOrDefaultAsync();
        if (expDate == default(DateTime) || expDate < DateTime.UtcNow)
        {
            await _satelliteRefreshService.RefreshSatelliteDataAsync();
        }
    }
public async Task<List<AllSatelliteDataResponse>?> GetAllSattellitesDataAsync()
{
    //await CheckForRefresh();
    
    var data = await _dbContext.Satellites
        .Select(s => new AllSatelliteDataResponse(s.Id, s.Name, s.Line1, s.Line2, s.ExpDate))
        .ToListAsync();
        
    return data;
}
    public async Task<MultipleSatelliteDataResponse?> GetMultipleSatellitesAsync()
    {
        await CheckForRefresh();
        try
        {
            var data = _dbContext.Satellites
                .Take(5)
                .ToList();

            var res = new List<SatelliteDataResponse>();
            return new MultipleSatelliteDataResponse(data.Select(s => new SatelliteDataResponse(s.Name, s.Line1, s.Line2)).ToList());
            // if (data != null)
            // {
            //     foreach (Models.Satellite s in data)
            //     {
            //         var pointsList = _orbitCalculator.CalculateOrbit(s.Name, s.Line1, s.Line2);

            //         var singleSatellite = new SatelliteDataResponse(s.Name, s.Line1, s.Line2);
            //         res.Add(singleSatellite);

            //     }
            //     return new MultipleSatelliteDataResponse(res);
            // }
            // return null;
        }
        catch (Exception)
        {
            return null;
        }

    }

    public async Task<SatelliteDataResponse?> GetSatelliteData()
    {
        await CheckForRefresh();
        try
        {
            var data = _dbContext.Satellites.Select(s => new SatelliteDataResponse(s.Name, s.Line1, s.Line2)).FirstOrDefault();
            return data;

            // if (data != null)
            // {
            //     var pointsList = _orbitCalculator.CalculateOrbit(data.Name, data.Line1, data.Line2);
            //     var response = new SatelliteDataResponse(data.Name, data.Line1, data.Line2);

            //     return response;
            // }
            // return null;
        }
        catch (Exception)
        {
            return null;
        }
    }
}



