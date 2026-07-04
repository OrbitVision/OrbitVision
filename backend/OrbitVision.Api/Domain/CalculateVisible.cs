using SGPdotNET.TLE;
using SGPdotNET.Observation;
using SGPdotNET.CoordinateSystem;
using SGPdotNET.Propagation;
using SGPdotNET.Util;

namespace OrbitVision.Api.Domain
{
    public class CalculateVisible
    {
        //need to return info about the time when the satellite is visible, and the azimuth and elevation angles at that time
        public void CheckIfVisible(string l1, string l2, double obsLat, double obsLon, double obsAlt)
        {
            var tle = new Tle("Satellite", l1, l2);
            var sgp4 = new Sgp4(tle);
            var observer = new GroundStation(new GeodeticCoordinate(obsLat, obsLon, obsAlt));

            var time = DateTime.UtcNow;
            var end = time.AddHours(12);

            while (time <= end)
            {
                var eci = sgp4.FindPosition(time);
                var lookingAngles = observer.IsVisible(eci, Angle.FromDegrees(10), time);
                if (lookingAngles == true)
                {
                    Console.WriteLine($"Satellite is visible at {time} UTC.");
                }
                time = time.AddMinutes(1);
            }
        }
    }
}