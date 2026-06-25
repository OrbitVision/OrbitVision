using Scalar.AspNetCore;
using Microsoft.AspNetCore.OpenApi;
using OrbitVision.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

//DB connection
builder.Services.AddDbContext<AppDbContext>(
    options => options.UseNpgsql(builder.Configuration.GetConnectionString("WebApiDatabase"))
);

builder.Services.AddControllers();
builder.Services.AddScoped<OrbitVision.API.Services.SatelliteService>();

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
app.MapControllers();
app.Run();


