using System;
using System.IO;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.FileProviders;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.Extensions;
using Microsoft.AspNetCore.NodeServices;
using AspNet.Security.OpenIdConnect.Primitives;
using FBK.Site.Data;
using FBK.Site.Models;
using FBK.Site.Services;

namespace FBK.Site
{
    public class Startup
    {
        private IHostingEnvironment _hostingEnv;

        public static void Main(string[] args)
        {
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseUrls("http://*:5000")
                .UseStartup<Startup>()
                .Build();

            host.Run();
        }

        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
            _hostingEnv = env;
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddDbContext<ApplicationDbContext>(options => 
            {
                options.UseMySql(Configuration.GetConnectionString("MysqlConnection"));
                options.UseOpenIddict();
            });

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.ClaimsIdentity.UserNameClaimType = OpenIdConnectConstants.Claims.Name;
                options.ClaimsIdentity.UserIdClaimType = OpenIdConnectConstants.Claims.Subject;
                options.ClaimsIdentity.RoleClaimType = OpenIdConnectConstants.Claims.Role;
            });

            services.AddOpenIddict(options => 
            {
                options.AddEntityFrameworkCoreStores<ApplicationDbContext>();
                options.AddMvcBinders();
                options.EnableTokenEndpoint("/account/token");
                options.AllowPasswordFlow();
                //options.AllowAuthorizationCodeFlow();
                options.AllowRefreshTokenFlow();
                options.DisableHttpsRequirement();
            });

            services.AddMvc();

            services.Configure<FormOptions>(options => options.MultipartBodyLengthLimit = int.MaxValue);
            services.AddNodeServices();

            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();

            var physProvider = _hostingEnv.ContentRootFileProvider;
            services.AddSingleton<IFileProvider>(physProvider);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.UseIdentity();
            app.UseOAuthValidation();
            app.UseOpenIddict();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}
