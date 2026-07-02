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
    public SatelliteService(AppDbContext dbContext, OrbitCalculator orbitCalculator)
    {
        _dbContext = dbContext;
        _orbitCalculator = orbitCalculator;
    }


    public async Task<List<string>?> GetAllNamesAsync()
    {
        try
        {
            var data = _dbContext.Satellites.Select(s => s.Name).ToList();
            return data;
        }
        catch (Exception)
        { 
            return null;  
        }
    }
    public async Task<MultipleSatellitesResponse?> GetMultipleSatellitesAsync()
    {
        try
        {
            var data = _dbContext.Satellites
                .Take(5)
                .ToList();

            var res = new List<SatelliteRouteResponse>();

            if (data != null)
            {
                foreach(Models.Satellite s in data)
                {
                    var pointsList = _orbitCalculator.CalculateOrbit(s.Name, s.Line1, s.Line2);
                    
                    var singleSatellite = new SatelliteRouteResponse(s.Name, pointsList);
                    res.Add(singleSatellite);
                    
                }
                return new MultipleSatellitesResponse(res);
            }
            return null;
        }
        catch (Exception)
        {
            return null;
        }
    
    }

    public async Task<SatelliteRouteResponse?> GetSatelliteData()
    {
        try
        {
            var data = _dbContext.Satellites.FirstOrDefault();
            if (data != null)
            {
                var pointsList = _orbitCalculator.CalculateOrbit(data.Name, data.Line1, data.Line2);
                var response = new SatelliteRouteResponse(data.Name, pointsList);

                return response;
            }
            return null;
        }
        catch (Exception)
        {
            return null;
        }
    }
}



