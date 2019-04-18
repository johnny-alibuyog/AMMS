using AMMS.Domain;
using AMMS.Domain.Common.Messages;
using AMMS.Domain.Common.Pipes.Auth;
using AMMS.Domain.Common.Pipes.Generics;
using AMMS.Domain.Common.Pipes.Validation;
using AMMS.Service.Host.Common.Auth;
using AutoMapper;
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
using Microsoft.Extensions.DependencyInjection.Extensions;
using Newtonsoft.Json.Serialization;
using Serilog;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using static AMMS.Domain.Membership.Messages.Users.CreateMessage;

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

            //services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.Configure<DbConfig>(_config.GetSection(nameof(DbConfig)));

            services.Configure<SecretConfig>(_config.GetSection(nameof(SecretConfig)));
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
                options.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
                options.AddSecurityRequirement(new Dictionary<string, IEnumerable<string>>()
                {
                    { "Bearer", new string[] { } },
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

            service.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

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
            var config = new MapperConfiguration(x => x.AddProfiles(typeof(TransformProfile).Assembly));

            registry.AddSingleton(config.CreateMapper());
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
}
