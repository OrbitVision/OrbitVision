using SGPdotNET.CoordinateSystem;
using SGPdotNET.Propagation;
using SGPdotNET.TLE;

namespace OrbitVision.API.Domain;

public class OrbitCalculator
{
    public List<SatellitePoint> CalculateOrbit(string name, string line1, string line2)
    {
        var tle = new Tle(name, line1, line2);
        var sgp4 = new Sgp4(tle);

        double meanMotion = tle.MeanMotionRevPerDay;
        double period = 1440.0 / meanMotion;
        double periodSeconds = period * 60.0;

        int totalPoints = 200;
        double step = periodSeconds / totalPoints;

        var pointsList = new List<SatellitePoint>();
        DateTime startTime = DateTime.UtcNow;

        for (int i = 0; i < totalPoints; i++)
        {
            double currentOffset = i * step;
            DateTime targetTime = startTime.AddSeconds(currentOffset);
            
            EciCoordinate eci = sgp4.FindPosition(targetTime);          
            GeodeticCoordinate geo = eci.ToGeodetic();
            
            pointsList.Add(new SatellitePoint(
                geo.Latitude.Degrees,
                geo.Longitude.Degrees,
                geo.Altitude,
                targetTime
            ));
        }

        return pointsList;
    }
}