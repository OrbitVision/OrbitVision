using Microsoft.AspNetCore.Mvc;
using OrbitVision.API.Services;

namespace OrbitVision.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    public AuthController(AuthService userService)
    {
        _authService = userService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDataResponse?>> Login([FromBody] LoginRequest user)
    {
        if(user == null || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
        {
            return BadRequest("Username and password are required.");
        }

        var res = await _authService.LoginAsync(user.Username, user.Password);
        if (res == null)
        {
            return Unauthorized();
        }

        var accessToken = res.Value.accessToken;
        var refreshToken = res.Value.refreshToken;

        Response.Cookies.Append("accessToken", accessToken, new CookieOptions{
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddMinutes(15),
            Path = "/"
        });

        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions{
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/"
        });

        return Ok(new {message = "Login successful", userData = res.Value.Item1});
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDataResponse?>> Register([FromBody] RegisterRequest request)
    {
        var res = await _authService.RegisterAsync(request.Username, request.Email, request.Password);
        if (!res)
        {
            return BadRequest("Username or email already exists.");
        }
        return Ok();
    }

    [HttpPost("refresh")]
    public async Task<ActionResult> RefreshToken()
    {
        Console.WriteLine("Attempting to refresh token in controller");
        if (!Request.Cookies.TryGetValue("refreshToken", out string? currentRefreshToken) || string.IsNullOrEmpty(currentRefreshToken))
        {
            return BadRequest(new { message = "Refresh token missing" });
        }

        var res = await _authService.RefreshTokenAsync(currentRefreshToken);
        if (res == null)
        {
            return Unauthorized();
        }

        var accessToken = res.Value.accessToken;
        var refreshToken = res.Value.refreshToken;

        Response.Cookies.Append("accessToken", accessToken, new CookieOptions{
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddMinutes(15),
            Path = "/"
        });

        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions{
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(7),
            Path = "/"
        });

        return Ok(new {message = "Refresh successfull"});
    }

}