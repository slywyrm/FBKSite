using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using OpenIddict.Core;
using OpenIddict.Models;
using FBK.Site.Data;
using FBK.Site.Models;
using FBK.Site.Services;

namespace FBKSiteAngular.Controllers
{
    [Authorize]
    public class AdminController : Controller
    {
        private UserManager<ApplicationUser> _userManager;
        private IFileProvider _fileProvider;
        private ApplicationDbContext _context;
        private IHostingEnvironment _environment;

        private string _dateFormat = "MMMM dd, yyyy H:mm";

        public AdminController(UserManager<ApplicationUser> userManager,
                               IFileProvider fileProvider,
                               ApplicationDbContext context,
                               IHostingEnvironment environment)
        {
            _userManager = userManager;
            _fileProvider = fileProvider;
            _context = context;
            _environment = environment;
        }

        [HttpGet("admin/profile")]
        public IActionResult Account()
        {
            var user = _userManager.FindByNameAsync(User.Identity.Name).Result;
            return Json(new {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            });
        }

        [HttpGet]
        public IActionResult GetReelFiles()
        {
            var files = _fileProvider.GetDirectoryContents("wwwroot/media/reel").Select(file => new { name = file.Name, uploaded = file.LastModified.DateTime.ToString(_dateFormat) });
            var selectedReel = (from setting in _context.Settings 
                            where setting.Class == "reel" && setting.Name == "videoURL" 
                            select setting.Value.ToString()).FirstOrDefault();
            selectedReel = selectedReel.Split('/').Last();
            
            return Json(new { selected = selectedReel, files = files });
        }

        [HttpPost]
        public async Task<IActionResult> SendReelFile(IFormFile formFile)
        {
            var name = formFile.FileName.Split('.').First();
            var ext = formFile.FileName.Split('.').Last();
            if (ext != "mp4")
                return Json(new { result = "error", error = "Wrong file type, use .mp4 file" });

            var fileNames = _fileProvider.GetDirectoryContents("wwwroot/media/reel").Select(file => file.Name);
            string finalName = name;
            if (fileNames.Contains(formFile.FileName))
            {
                int max = 0;
                foreach (string fileName in fileNames.Where(f => f.StartsWith(name)))
                {
                    int value = 0;
                    if(int.TryParse(Regex.Match(fileName, @"(?<=\()([0-9]*?)(?=\))").Value, out value))
                        max = Math.Max(max, value);
                }

                finalName += String.Format("({0})", max + 1);
            }
            finalName += ".mp4";

            var path = _environment.WebRootPath + "/media/reel/" + finalName;
            if (formFile.Length > 0)
            {
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await formFile.CopyToAsync(stream);
                }
            }

            return Ok(new { result = "success", file = new { name = finalName, uploaded = DateTime.Now.ToString(_dateFormat) } });
        }

        [HttpPost]
        public IActionResult RemoveReelFile(string fileName)
        {
            string filePath = _fileProvider.GetDirectoryContents("wwwroot/media/reel").Where(f => f.Name == fileName).FirstOrDefault().PhysicalPath;
            FileInfo file = new FileInfo(filePath);
            file.Delete();
            return Ok(new { result = "success"});
        }

        [HttpPost]
        public async Task<IActionResult> ChooseReel(string file)
        {
            _context.Settings.Where(setting => setting.Class == "reel" && setting.Name == "videoURL").FirstOrDefault().Value = "media/reel/" + file;
            await _context.SaveChangesAsync();
            return Ok(new { result = "success" });                               
        }

        [HttpPost]
        public async Task<IActionResult> ChangeSetting(string sClass, string sName, string sValue)
        {
            _context.Settings.Where(setting => setting.Class == sClass && setting.Name == sName).FirstOrDefault().Value = sValue;
            var result = await _context.SaveChangesAsync();
            return Ok(new { result = "success" });                               
        }
        
        [HttpPost]
        public async Task<IActionResult> AddPortfolioElem([FromBody] FBKPortfolioElement element)
        {
            var elemToUpdate = await _context.Portfolio.AsNoTracking().Include(e => e.Stills).SingleOrDefaultAsync(i => i.ID == element.ID);
            if (elemToUpdate != null)
            {
                _context.Portfolio.Update(element);
                foreach (var still in elemToUpdate.Stills)
                    if (!element.Stills.Any(i => i.ID == still.ID))
                        _context.MovieStillls.Remove(still);

                foreach (var still in element.Stills)
                {
                    var stillToUpdate = await _context.MovieStillls.Where(i => i.ID == still.ID).SingleOrDefaultAsync();
                    if (stillToUpdate != null)
                    {
                        _context.MovieStillls.Update(still);
                    }
                    else
                    {
                        await _context.MovieStillls.AddAsync(still);
                    }
                }
            }
            else
                await _context.Portfolio.AddAsync(element);
            await _context.SaveChangesAsync();
            return Ok(new { result = "success", element = element });
        }

        [HttpPost]
        public async Task<IActionResult> RemovePortfolioElem([FromBody] FBKPortfolioElement elem)
        {
            _context.Portfolio.Remove(elem);
            await _context.SaveChangesAsync();
            return Ok(new { result = "success", elem = elem });
        }

        [HttpGet]
        public IActionResult MediaFiles()
        {
            var fileslist = (from year in _fileProvider.GetDirectoryContents("wwwroot/media/uploads/")
                             select new 
                             { 
                                 year = year.Name, 
                                 months = (from month in _fileProvider.GetDirectoryContents("wwwroot/media/uploads/" + year.Name)
                                           select new 
                                           {
                                               month = month.Name,
                                               files = _fileProvider.GetDirectoryContents(String.Format("wwwroot/media/uploads/{0}/{1}/", year.Name, month.Name))
                                                                    .Select(file => file.Name).ToList()
                                           }).ToList()
                             }).ToList();
            return Json(fileslist);
        }

        [HttpPost]
        public async Task<IActionResult> SendMediaFile(IFormFile formFile)
        {
            CultureInfo ci = new CultureInfo("en-US");
            string ext = formFile.FileName.Split('.')[1];
            string path = String.Format("{0}/{1}/{2}/", "media/uploads", DateTime.Now.Year, DateTime.Now.ToString("MMMM", ci));
            string name = DateTime.Now.ToString("yyyy-MMM-dd-H-mm-ss") + "." + ext;
            
            Directory.CreateDirectory(_environment.WebRootPath + '/' + path);
            
            using (var stream = new FileStream(_environment.WebRootPath + '/' + path + name, FileMode.Create))
            {
                await formFile.CopyToAsync(stream);
            }

            return Json(new { result = "success", link = path + name, year = DateTime.Now.Year, month = DateTime.Now.ToString("MMMM", ci), file = name });
        }

        [HttpPost]
        public async Task<IActionResult> ChangePortfolio([FromBody] List<FBKPortfolioElement> portfolio)
        {
            foreach (var element in portfolio)
                await this.AddPortfolioElem(element);
            foreach (var element in _context.Portfolio)
                if (!portfolio.Contains(element)) {
                    _context.Portfolio.Remove(element);
                    await _context.SaveChangesAsync();
                }
            return Ok(new { result = "success" });
        }

        [HttpPost]
        public async Task<IActionResult> ChangeServices([FromBody] List<FBKService> services)
        {
            foreach (FBKService service in services)
                _context.Services.Update(service);
            await _context.SaveChangesAsync();
            return Ok(new { result = "success" });
        }
    }
}