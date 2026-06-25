using OrbitVision.API.Data;
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
    public SatelliteService(HttpClient httpClient, AppDbContext dbContext)
    {
        _httpProvider = httpClient;
        _dbContext = dbContext;
    }

    public async Task<SatelliteRouteResponse?> GetSatelliteData()
    {
        try
        {
            // var url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=STATIONS&FORMAT=TLE";
            // string rawData = await _httpProvider.GetStringAsync(url);

            // string[] lines = rawData.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries)
            //                         .Select(line => line.TrimEnd())
            //                         .ToArray();

            // var tleList = new List<TleEntry>();

            // for (int i = 0; i <= lines.Length - 3; i += 3)
            // {
            //     tleList.Add(new TleEntry
            //     {
            //         Name = lines[i],
            //         Line1 = lines[i + 1],
            //         Line2 = lines[i + 2]
            //     });
            // }

            // var tleArray = tleList.ToArray();
            

            var data = _dbContext.Satellites.FirstOrDefault();
            if (data != null)
            {
                var tle = new Tle(data.Name, data.Line1, data.Line2);
                var t = new Sgp4(tle);

                ///////////////////////
                double meanMotion = tle.MeanMotionRevPerDay;
                double period = 1440.0 / meanMotion;
                double periodS = period * 60.0;
                ///////////////////////

                int totalPoints = 200;
                double step = periodS / totalPoints;

                var pointsList = new List<SatellitePoint>();
                DateTime startTime = DateTime.UtcNow;

                // Generowanie punktów na najbliższe 10 minut co 10 sekund
                for (int i = 0; i < totalPoints; i++)
                {
                    double currentOf = i * step;
                    DateTime targetTime = startTime.AddSeconds(currentOf);
                    EciCoordinate eci = t.FindPosition(targetTime);          
                    GeodeticCoordinate geo = eci.ToGeodetic();
                    
                    pointsList.Add(new SatellitePoint(
                        geo.Latitude.Degrees,
                        geo.Longitude.Degrees,
                        geo.Altitude,
                        targetTime
                    ));
                }

                var response = new SatelliteRouteResponse(data.Name, pointsList);

                return response;
            }

            // if (tleArray.Length > 0)
            // {
            //     var tle = new Tle(tleArray[0].Name, tleArray[0].Line1, tleArray[0].Line2);
            //     var t = new Sgp4(tle);

            //     ///////////////////////
            //     double meanMotion = tle.MeanMotionRevPerDay;
            //     double period = 1440.0 / meanMotion;
            //     double periodS = period * 60.0;
            //     ///////////////////////

            //     int totalPoints = 200;
            //     double step = periodS / totalPoints;

            //     var pointsList = new List<SatellitePoint>();
            //     DateTime startTime = DateTime.UtcNow;

            //     // Generowanie punktów na najbliższe 10 minut co 10 sekund
            //     for (int i = 0; i < totalPoints; i++)
            //     {
            //         double currentOf = i * step;
            //         DateTime targetTime = startTime.AddSeconds(currentOf);
            //         EciCoordinate eci = t.FindPosition(targetTime);          
            //         GeodeticCoordinate geo = eci.ToGeodetic();
                    
            //         pointsList.Add(new SatellitePoint(
            //             geo.Latitude.Degrees,
            //             geo.Longitude.Degrees,
            //             geo.Altitude,
            //             targetTime
            //         ));
            //     }

            //     var response = new SatelliteRouteResponse(tleArray[0].Name, pointsList);

            //     return response;
            // }

            return null;
        }
        catch (Exception)
        {
            return null;
        }
    }
}



