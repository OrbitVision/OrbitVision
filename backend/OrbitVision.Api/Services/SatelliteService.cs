using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
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
    public SatelliteService(HttpClient httpClient)
    {
        _httpProvider = httpClient;
    }

    public async Task<TleEntry[]> GetSatelliteData()
    {
        try
        {
            var url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=STATIONS&FORMAT=TLE";
            string rawData = await _httpProvider.GetStringAsync(url);

            string[] lines = rawData.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries)
                                    .Select(line => line.TrimEnd())
                                    .ToArray();

            var tleList = new List<TleEntry>();

            for (int i = 0; i <= lines.Length - 3; i += 3)
            {
                tleList.Add(new TleEntry
                {
                    Name = lines[i],
                    Line1 = lines[i + 1],
                    Line2 = lines[i + 2]
                });
            }

            var tleArray = tleList.ToArray();
            
            if (tleArray.Length > 0)
            {
                var tle = new Tle(tleArray[0].Name, tleArray[0].Line1, tleArray[0].Line2);
                var t = new Sgp4(tle);
                
                DateTime targetTime = DateTime.UtcNow;

                EciCoordinate eci = t.FindPosition(targetTime);
                


                GeodeticCoordinate geo = eci.ToGeodetic();

     
                double latitude = geo.Latitude.Degrees;
                double longitude = geo.Longitude.Degrees;
                double altitude = geo.Altitude; 

                Console.WriteLine($"Satellite: {tleArray[0].Name}");
                Console.WriteLine($"Latitude:  {latitude:F4}°");
                Console.WriteLine($"Longitude: {longitude:F4}°");
                Console.WriteLine($"Altitude:  {altitude:F2} km");
            }

            return tleArray;
        }
        catch (Exception)
        {
            return Array.Empty<TleEntry>();
        }
    }
}