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

public class SatelliteService
{
    private readonly HttpClient _httpProvider;
    private readonly AppDbContext _dbContext;
    private readonly OrbitCalculator _orbitCalculator;
    public SatelliteService(HttpClient httpClient, AppDbContext dbContext, OrbitCalculator orbitCalculator)
    {
        _httpProvider = httpClient;
        _dbContext = dbContext;
        _orbitCalculator = orbitCalculator;
    }

    public async Task<MultipleSatellitesResponse?> GetMultipleSatellitesAsync()
    {
        try
        {
            var data = _dbContext.Satellites
                .Take(3)
                .ToList();

            var res = new List<SatelliteRouteResponse>();

            if (data != null)
            {
                foreach(Models.Satellite s in data)
                {
                    // var tle = new Tle(s.Name, s.Line1, s.Line2);
                    // var t = new Sgp4(tle);

                    // ///////////////////////
                    // double meanMotion = tle.MeanMotionRevPerDay;
                    // double period = 1440.0 / meanMotion;
                    // double periodS = period * 60.0;
                    // ///////////////////////

                    // int totalPoints = 200;
                    // double step = periodS / totalPoints;

                    // var pointsList = new List<SatellitePoint>();
                    // DateTime startTime = DateTime.UtcNow;

                    // // Generowanie punktów na najbliższe 10 minut co 10 sekund
                    // for (int i = 0; i < totalPoints; i++)
                    // {
                    //     double currentOf = i * step;
                    //     DateTime targetTime = startTime.AddSeconds(currentOf);
                    //     EciCoordinate eci = t.FindPosition(targetTime);          
                    //     GeodeticCoordinate geo = eci.ToGeodetic();
                        
                    //     pointsList.Add(new SatellitePoint(
                    //         geo.Latitude.Degrees,
                    //         geo.Longitude.Degrees,
                    //         geo.Altitude,
                    //         targetTime
                    //     ));
                    // }
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
                // var tle = new Tle(data.Name, data.Line1, data.Line2);
                // var t = new Sgp4(tle);

                // ///////////////////////
                // double meanMotion = tle.MeanMotionRevPerDay;
                // double period = 1440.0 / meanMotion;
                // double periodS = period * 60.0;
                // ///////////////////////

                // int totalPoints = 200;
                // double step = periodS / totalPoints;

                // var pointsList = new List<SatellitePoint>();
                // DateTime startTime = DateTime.UtcNow;

                // // Generowanie punktów na najbliższe 10 minut co 10 sekund
                // for (int i = 0; i < totalPoints; i++)
                // {
                //     double currentOf = i * step;
                //     DateTime targetTime = startTime.AddSeconds(currentOf);
                //     EciCoordinate eci = t.FindPosition(targetTime);          
                //     GeodeticCoordinate geo = eci.ToGeodetic();
                    
                //     pointsList.Add(new SatellitePoint(
                //         geo.Latitude.Degrees,
                //         geo.Longitude.Degrees,
                //         geo.Altitude,
                //         targetTime
                //     ));
                // }

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



