using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Serilog;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Prometheus;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

public class Program
{
    public static void Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .WriteTo.Console()
            .WriteTo.File("logs/ECommerceApiGatewayLog.txt", rollingInterval: RollingInterval.Day)
            .CreateLogger();

        try
        {
            Log.Information("Starting API Gateway");
            CreateHostBuilder(args).Build().Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Application start-up failed");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .UseSerilog() // Use Serilog
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder
                .ConfigureServices(s => s.AddSingleton(webBuilder))
                    .ConfigureAppConfiguration(
                          ic => ic.AddJsonFile(Path.Combine("","ocelot.json")))
                    .UseStartup<Startup>()
                    .UseUrls("http://*:5000") // Set the port here;
                    ;
            });
}

public class Startup
{
    private readonly IConfiguration _configuration;

    public Startup(IConfiguration configuration)
    {
        _configuration = configuration;
    }
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors(options =>
        {
            //policy 1 - any method,any header
            options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.WithOrigins("http://localhost:5173", "http://localhost:7173") // Replace with your React app's URL
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   //.WithExposedHeaders("Authorization")
                   .AllowCredentials();
                });

            // Policy 2 - WithMethods("GET", "POST"), any header, expose header ("Authorization")
            options.AddPolicy("Origin2Policy", builder =>
            {
                builder.WithOrigins("http://another-trusted-origin.com") // Replace with your second origin
                       .WithMethods("GET", "POST") // Specify allowed methods for this origin
                       .AllowAnyHeader()
                       .WithExposedHeaders("Authorization")
                       .AllowCredentials();
            });
        });

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = _configuration["Jwt:Issuer"], // Replace with your issuer
                ValidAudience = _configuration["Jwt:Audience"], // Replace with your audience
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])) // Replace with your key
            };
        });

        services.AddOcelot();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseRouting();
        app.UseCors("CorsPolicy");

        app.UseAuthentication();
        app.UseAuthorization();

        // Enable Prometheus metrics
        app.UseMetricServer(); // Exposes /metrics endpoint
        app.UseHttpMetrics();  // Collects metrics for HTTP requests

        //app.UseEndpoints(endpoints =>
        //{
        //    endpoints.MapControllers();
        //});

        app.UseOcelot().Wait();
    }
}
