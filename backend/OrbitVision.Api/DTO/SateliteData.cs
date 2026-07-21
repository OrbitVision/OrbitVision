public record MultipleSatellitesResponse(
    List<SatelliteRouteResponse> Satellites
);

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


//returning tle to offload the calculation of the satellite position to the client side, so that the server does not have to do it
public record SatelliteDataResponse(
    string SatelliteName, 
    string tle1,
    string tle2
);

public record AllSatelliteDataResponse(
    int Id,
    string SatelliteName, 
    string tle1,
    string tle2,
    DateTime expDate
);



public record MultipleSatelliteDataResponse(
    List<SatelliteDataResponse> Satellites
);