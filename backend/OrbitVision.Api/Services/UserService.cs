using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using OrbitVision.API.Data;
using OrbitVision.API.Models;

namespace OrbitVision.API.Services;


public class UserService
{
    private readonly AppDbContext _dbContext;
    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserDataResponse?> LoginAsync(string username, string password)
    {
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username && u.Password == password);
        if (user == null)
        {
            return null;
        }

        return new UserDataResponse(user.Username, user.Email);
    }

    public async Task<bool> RegisterAsync(string username, string email, string password)
    {
        var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username || u.Email == email);
        if (existingUser != null)
        {
            return false;
        }

        var newUser = new User
        {
            Username = username,
            Email = email,
            Password = password
        };

        _dbContext.Users.Add(newUser);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}