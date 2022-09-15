using Lamar.Microsoft.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using System;

namespace AMMS.Service.Host;

//docs: https://docs.microsoft.com/en-us/aspnet/core/fundamentals/startup?view=aspnetcore-2.2
public class Program
{
    public static void Main(string[] args)
    {
        Log.Logger = CreateLogger();

        try
        {
            Log.Information("Starting web host");
            CreateWebHostBuilder(args).Build().Run();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    private static ILogger CreateLogger()
    {
        return new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .CreateLogger();
    }

    private static IHostBuilder CreateWebHostBuilder(string[] args)
    {

        return new HostBuilder()
            .UseLamar()
            .UseSerilog()
            .ConfigureAppConfiguration((context, config) => 
                config.AddJsonFile("appsettings.json", optional: false)
            )
            .ConfigureWebHostDefaults(host => 
                host.UseStartup<Startup>()
            );
    }
}
