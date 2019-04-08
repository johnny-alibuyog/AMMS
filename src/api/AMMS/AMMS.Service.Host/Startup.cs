using AMMS.Domain;
using AMMS.Domain.Common.Pipes;
using AMMS.Domain.Users.Messages;
using FluentValidation.AspNetCore;
using Lamar;
using MediatR;
using MediatR.Pipeline;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Serialization;
using Serilog;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.IO;
using System.Reflection;

namespace AMMS.Service.Host
{
    public class Startup
    {
        private readonly IHostingEnvironment _env;
        private readonly IConfiguration _config;
        private readonly ILogger _logger;

        public Startup(IHostingEnvironment env, IConfiguration config, ILogger logger = null)
        {
            this._env = env;
            this._config = config;
            this._logger = logger ?? Log.ForContext<Startup>();
        }

        // Take in Lamar's ServiceRegistry instead of IServiceCollection as your argument, but fear not, it implements IServiceCollection as well
        public void ConfigureContainer(ServiceRegistry services)
        {
            services.ConfigureServiceMvc();

            services.ConfigureServiceIoc();

            services.Configure<DbConfig>(this._config.GetSection(nameof(DbConfig)));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            this._logger.Information("Logged in Configure");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseServiceMvc();
        }
    }

    internal static class ConfigureMvc
    {
        public static void ConfigureServiceMvc(this IServiceCollection services)
        {
            var xmlPath = Path.Combine(AppContext.BaseDirectory, Assembly.GetExecutingAssembly().GetName().Name + ".xml");

            services.AddMvc()
                .AddFluentValidation(x => x.RegisterValidatorsFromAssemblyContaining<DbContext>())
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(o => o.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver());

            // Register the Swagger generator, defining 1 or more Swagger documents
            services.AddSwaggerGen();

            services.ConfigureSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new Info()
                {
                    Version = "v1",
                    Title = "AMMS",
                    Description = "AMMS Documentation"
                });
                options.IncludeXmlComments(xmlPath);
                options.DescribeAllEnumsAsStrings();
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

            app.UseMvc();
        }
    }

    internal static class ConfigureIoc
    {
        public static void ConfigureServiceIoc(this ServiceRegistry service)
        {
            service.AddScoped<DbContext>();

            service.AddSingleton(Log.Logger);

            service.ConfigureMediatR();

            // Also exposes Lamar specific registrations and functionality
            service.Scan(scanner =>
            {
                scanner.TheCallingAssembly();
                scanner.WithDefaultConventions();
            });
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
            registry.For(typeof(IPipelineBehavior<,>)).Add(typeof(GenericPipelineBehavior<,>));
            registry.For(typeof(IPipelineBehavior<,>)).Add(typeof(GenericValidaltionBehavior<,>));
            registry.For(typeof(IRequestPreProcessor<>)).Add(typeof(GenericRequestPreProcessor<>));
            registry.For(typeof(IRequestPostProcessor<,>)).Add(typeof(GenericRequestPostProcessor<,>));

            // This is the default but let's be explicit. At most we should be container scoped.
            registry.For<IMediator>().Use<Mediator>().Transient();
            registry.For<ServiceFactory>().Use(ctx => ctx.GetInstance);
        }
    }
}
