public record SatelliteRouteResponse(
    string SatelliteName, 
    List<SatellitePoint> Points
);

public record SatellitePoint(
    double Latitude, 
    double Longitude, 
    double AltitudeKilometers, 
    DateTime Timestamp
);