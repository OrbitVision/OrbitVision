namespace OrbitVision.API.Services;

public class SatelliteService
{
    private readonly HttpClient _httpProvider;
    public SatelliteService(HttpClient httpClient)
    {
        _httpProvider = httpClient;
    }
    public async Task<string> GetSatelliteData()
    {
        try
        {
            var url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=STATIONS&FORMAT=TLE";
            return await _httpProvider.GetStringAsync(url);
        }
        catch (Exception ex)
        {
            return ex.Message;
        }
    }
}

