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








var app = builder.Build();

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


