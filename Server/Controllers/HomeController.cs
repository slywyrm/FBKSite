using System;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using FBK.Site.Data;
using FBK.Site.Services;
using FBK.Site.Models;

namespace FBK.Site.Controllers
{
    public class HomeController : Controller
    {
        ApplicationDbContext _context;
        IEmailSender _emailSender;

        public HomeController (ApplicationDbContext context, IEmailSender sender)
        {
            _context = context;
            _emailSender = sender;
        }

        public async Task<IActionResult> Index()
        {
            var nodeServices = Request.HttpContext.RequestServices.GetRequiredService<INodeServices>();
            var hostEnv = Request.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();

            var applicationBasePath = hostEnv.ContentRootPath;
            var requestFeature = Request.HttpContext.Features.Get<IHttpRequestFeature>();
            var unencodedPathAndQuery = requestFeature.RawTarget;
            var unencodedAbsoluteUrl = $"{Request.Scheme}://{Request.Host}{unencodedPathAndQuery}";

            // Prerender / Serialize application (with Universal)
            var prerenderResult = await Prerenderer.RenderToString(
                "/",
                nodeServices,
                new JavaScriptModuleExport(applicationBasePath + "/Client/dist/main-server"),
                unencodedAbsoluteUrl,
                unencodedPathAndQuery,
                null,
                30000,
                Request.PathBase.ToString()
            );

            ViewData["SpaHtml"] = prerenderResult.Html;
            ViewData["Title"] = "Frame Bakery";//prerenderResult.Globals["title"];
            ViewData["Styles"] = "";//prerenderResult.Globals["styles"];
            ViewData["Meta"] = prerenderResult.Globals["meta"];
            ViewData["Links"] = prerenderResult.Globals["links"];

            return View();
        }

        [HttpGet]
        public JsonResult GetSettings(/*string setClass, string setName*/)
        {
            /*var setting = await (from s in _context.Settings 
                                 where s.Class == setClass && s.Name == setName 
                                 select new { sClass = s.Class, s.Name, s.Value }).FirstOrDefaultAsync();*/
            var settings = _context.Settings.Select(i => new { sClass = i.Class, i.Name, i.Value }).ToList();
            return Json(settings);
        }

        [HttpGet]
        public async Task<JsonResult> GetPortfolio()
        {
            var data = await _context.Portfolio.Include(p => p.Stills).ToListAsync();
            return Json(data);
        }

        [HttpGet]
        public JsonResult GetServices()
        {
            var data = _context.Services.ToList();
            return Json(data);
        }

        [HttpGet]
        public async Task<JsonResult> Contact(int id)
        {
            var result = await (from c in _context.Contacts
                                where c.ID == id select c).FirstOrDefaultAsync();
            return Json(result);
        }

        /*[HttpPost]
        public async Task<IActionResult> AddContact([FromBody] FBKContact contact)
        {
            if (contact == null)
                return BadRequest();
            await this._context.Contacts.AddAsync(contact);
            await this._context.SaveChangesAsync();
            this.sendContact(contact);
            return CreatedAtRoute("Home/Contact", new { id = contact.ID }, contact);
        }*/

        public IActionResult Error()
        {
            return View();
        }

        private async void sendContact(FBKContact contact)
        {
            var subject = String.Format("FBK Site: New contact ({0})", contact.Name);
            await this._emailSender.SendEmailAsync("ps@framebakery.tv", subject, contact.ToString());
        }
    }
}
