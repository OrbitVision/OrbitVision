using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using OrbitVision.API.Data;
using OrbitVision.API.Models;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using BCrypt.Net;

namespace OrbitVision.API.Services;


public class AuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    public AuthService(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    public async Task<(UserDataResponse, string accessToken, string refreshToken)?> LoginAsync(string username, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            return null;
        }

        var accessToken = GenerateToken(user);
        var refreshToken = Guid.NewGuid().ToString();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); 
        await _dbContext.SaveChangesAsync();

        return (new UserDataResponse(user.Username, user.Email), accessToken, refreshToken);
    }

    public async Task<bool> RegisterAsync(string username, string email, string password)
    {
        var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username || u.Email == email);
        if (existingUser != null)
        {
            return false;
        }

        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
        var newUser = new User
        {
            Username = username,
            Email = email,
            Password = hashedPassword
        };

        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();

        return true;
    }

    public async Task<(string accessToken, string refreshToken)?> RefreshTokenAsync(string currentRefreshToken)
    {
        Console.WriteLine("Attempting to refresh");
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.RefreshToken == currentRefreshToken);
        if(user == null || !user.RefreshTokenExpiryTime.HasValue || user.RefreshTokenExpiryTime < DateTime.UtcNow)
        {
            return null;
        }

        var accesstoken = GenerateToken(user);
        var refreshtoken = Guid.NewGuid().ToString();

        user.RefreshToken = refreshtoken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await _dbContext.SaveChangesAsync();

        return (accesstoken, refreshtoken);
    }

    public string GenerateToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var claims = new[]
        {
            new Claim("UserId", user.Id.ToString()),
            new Claim("Username", user.Username),
            new Claim("Email", user.Email)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryMinutes"]!)),
            //expires: DateTime.UtcNow.AddSeconds(15),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}