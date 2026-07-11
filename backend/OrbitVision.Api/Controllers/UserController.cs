using Microsoft.AspNetCore.Mvc;
using OrbitVision.API.Services;

namespace OrbitVision.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;
    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDataResponse?>> Login([FromBody] LoginRequest request)
    {
        var userData = await _userService.LoginAsync(request.Username, request.Password);
        if (userData == null)
        {
            return Unauthorized();
        }
        return Ok(userData);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDataResponse?>> Register([FromBody] RegisterRequest request)
    {
        var res = await _userService.RegisterAsync(request.Username, request.Email, request.Password);
        if (!res)
        {
            return BadRequest("Username or email already exists.");
        }
        return Ok();
    }


}