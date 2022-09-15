using AMMS.Domain;
using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Common.Pipes.Generics;
using AMMS.Domain.Common.Pipes.Validation;
using AMMS.Domain.Membership.Messages.Dtos;
using AMMS.Service.Host.Common.Auth;
using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Lamar;
using MediatR;
using MediatR.Pipeline;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Serilog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using static AMMS.Domain.Membership.Messages.Users.UserCreate;

namespace AMMS.Service.Host;

public class Startup
{
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;
    private readonly ILogger _logger;

    public Startup(IWebHostEnvironment env, IConfiguration config, ILogger logger = null)
    {
        this._env = env;
        this._config = config;
        this._logger ??= Log.ForContext<Startup>();
    }

    // Take in Lamar's ServiceRegistry instead of IServiceCollection as your argument, but fear not, it implements IServiceCollection as well
    public void ConfigureContainer(ServiceRegistry services)
    {
        services.ConfigureServiceMvc();

        services.ConfigureServiceIoc();

        //services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
      
        services.ConfigureSettings(_config);
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        this._logger.Information("Logged in Configure");

        if (env.IsDevelopment())
        {
            //app.UseDeveloperExceptionPage();
            //app.UseStatusCodePagesWithRedirects();
        }

        app.UseServiceMvc();
    }
}

internal static class ConfigureMvc
{
    public static void ConfigureServiceMvc(this IServiceCollection services)
    {
        var xmlPath = Path.Combine(AppContext.BaseDirectory, Assembly.GetExecutingAssembly().GetName().Name + ".xml");

        services.AddFluentValidationAutoValidation();
        services.AddFluentValidationClientsideAdapters();
        services.AddValidatorsFromAssemblyContaining<TenantValidator>();

        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.DictionaryKeyPolicy = JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });

        //services.AddControllersWithViews()
        //    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        // Register the Swagger generator, defining 1 or more Swagger documents
        services.AddSwaggerGen();

        services.ConfigureSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo()
            {
                Version = "v1",
                Title = "AMMS",
                Description = "AMMS Documentation"
            });
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
            {
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            options.AddSecurityRequirement(new OpenApiSecurityRequirement()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Id = "Bearer",
                            Type = ReferenceType.SecurityScheme,
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header,

                    },
                    new List<string>()
                }
            });
            options.IncludeXmlComments(xmlPath);
            //options.DescribeAllEnumsAsStrings();
            options.CustomSchemaIds(x => x.FullName);
        });
    }

    public static void UseServiceMvc(this IApplicationBuilder app)
    {
        // Enable middleware to serve generated Swagger as a JSON endpoint.
        app.UseSwagger();

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AMMS V1"));

        app.UsePathBase(new PathString("/api"));

        //app.Use
        //app.UseMvc(option => option.EnableEndpointRouting = false);

        app.UseRouting();

        app.UseCors();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }

    public static void ConfigureSettings(this IServiceCollection services, IConfiguration config)
    {

        services.Configure<DbConfig>(config.GetSection(nameof(DbConfig)));

        services.Configure<SecretConfig>(config.GetSection(nameof(SecretConfig)));
    }
}

internal static class ConfigureIoc
{
    public static void ConfigureServiceIoc(this ServiceRegistry service)
    {
        //service.AddScoped<DbContext>();

        service.AddSingleton(Log.Logger);

        service.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        service.ConfigureDb();

        service.ConfigureMediatR();

        service.ConfigureLamar();

        service.ConfigureAuthorization();

        service.ConfigureAutoMapper();
    }

    private static void ConfigureMediatR(this ServiceRegistry registry)
    {
        // Also exposes Lamar specific registrations and functionality
        registry.Scan(scanner =>
        {
            scanner.AssemblyContainingType<DbContext>();
            scanner.ConnectImplementationsToTypesClosing(typeof(IRequestHandler<,>));
            scanner.ConnectImplementationsToTypesClosing(typeof(INotificationHandler<>));
        });

        //Pipeline
        registry.For(typeof(IPipelineBehavior<,>)).Add(typeof(RequestPreProcessorBehavior<,>));
        registry.For(typeof(IPipelineBehavior<,>)).Add(typeof(RequestPostProcessorBehavior<,>));
        registry.For(typeof(IPipelineBehavior<,>)).Add(typeof(AuthBehavior<,>));
        registry.For(typeof(IPipelineBehavior<,>)).Add(typeof(ValidaltionBehavior<,>));
        registry.For(typeof(IPipelineBehavior<,>)).Add(typeof(GenericPipelineBehavior<,>));
        registry.For(typeof(IRequestPreProcessor<>)).Add(typeof(GenericRequestPreProcessor<>));
        registry.For(typeof(IRequestPostProcessor<,>)).Add(typeof(GenericRequestPostProcessor<,>));

        // This is the default but let's be explicit. At most we should be container scoped.
        registry.For<IMediator>().Use<Mediator>().Transient();
        registry.For<ServiceFactory>().Use(ctx => ctx.GetInstance);

        registry.For<IHandlerDependencyHolder>().Use<HandlerDependencyHolder>();

        // this will be 
        registry.Policies.SetAllProperties(policy =>
        {
            policy.TypeMatches((x) => x == typeof(IContext));
        });
    }

    private static void ConfigureLamar(this ServiceRegistry registry)
    {
        // Also exposes Lamar specific registrations and functionality
        registry.Scan(scanner =>
        {
            scanner.TheCallingAssembly();
            scanner.WithDefaultConventions();
        });
    }

    private static void ConfigureAutoMapper(this ServiceRegistry registry)
    {
        // AutoMapper Configurations
        registry.AddSingleton((serviceProvider) =>
        {
            var assemblies = new[] { typeof(TransformProfile).Assembly };
            var mappingConfig = new MapperConfiguration(x => x.AddMaps(assemblies));
            return mappingConfig.CreateMapper();
        });
    }

    private static void ConfigureDb(this ServiceRegistry registry)
    {
        registry.Scan(scanner =>
        {
            scanner.AssemblyContainingType(typeof(IClassMap));
            scanner.AddAllTypesOf<IClassMap>();
            scanner.WithDefaultConventions();
        });

        registry.For<IClassMapInitializer>().Use<ClassMapInitializer>().Singleton();

        registry.AddScoped<DbContext>();
    }

    private static void ConfigureAuthorization(this ServiceRegistry registry)
    {
        registry.For<ITokenExtractor>().Use<BearerTokenExtractor>().Scoped();

        registry.For<ITokenProvider>().Use<TokenProvider>().Scoped();

        registry.For<IContextProvider>().Use<ContextProvider>().Scoped();

        registry.For<IAuthProvider>().Use<AuthProvider>().Scoped();

        registry.For<IContext>().Use(GetContext).Scoped();

        registry.Scan(scanner =>
        {
            scanner.AssemblyContainingType(typeof(IAccessControl<>));
            scanner.ConnectImplementationsToTypesClosing(typeof(IAccessControl<>));
        });

        IContext GetContext(IServiceContext context) => context.GetInstance<IContextProvider>().GetContext();
    }
}
