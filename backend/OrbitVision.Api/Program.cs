using Scalar.AspNetCore;
using OrbitVision.API.Data;
using OrbitVision.API.Services;
using OrbitVision.API.Domain;
using Microsoft.EntityFrameworkCore;
using OrbitVision.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

//DB connection
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("WebApiDatabase"))
);

builder.Services.AddControllers();
builder.Services.AddScoped<ISatelliteService, SatelliteService>();
builder.Services.AddScoped<ISatelliteRefreshService, SatelliteRefreshService>();
builder.Services.AddScoped<IWatchListService, WatchListService>();
builder.Services.AddScoped<OrbitCalculator>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddHttpClient<SattelliteControler>(client =>
{
    client.DefaultRequestHeaders.UserAgent.ParseAdd("OrbitVisionAPI/1.0");
});


builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:5173", "https://orbitvision.vercel.app")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = false, //chwilowo
        ValidateAudience = false, //chwilowo
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero, //Na testy bo mi dodaje 5min
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]!)
        )
    };
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if(context.Request.Cookies.TryGetValue("accessToken", out string? token))
            {
                Console.WriteLine("TOKEN SPRAWDZONY");
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

var app = builder.Build();

app.UseCors();

//if (app.Environment.IsDevelopment())
//{
app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.Authentication = null;
});
//}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();


