using Scalar.AspNetCore;
using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();

builder.Services.AddHttpClient();

// TODO - DBCONTEXT

//////

// Adding Controllers to main app flow
builder.Services.AddControllers();
builder.Services.AddScoped<OrbitVision.API.Services.SatelliteService>();




builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:5173").AllowCredentials()
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


