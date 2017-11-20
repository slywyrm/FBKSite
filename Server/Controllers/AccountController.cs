using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.Extensions.Options;
using AspNet.Security.OpenIdConnect.Extensions;
using AspNet.Security.OpenIdConnect.Primitives;
using AspNet.Security.OpenIdConnect.Server;
using OpenIddict.Core;
using OpenIddict.Models;
using FBK.Site.Models;
using FBK.Site.Data;

namespace FBKSiteAngular.Controllers
{
    public class AccountController : Controller
    {
        private readonly OpenIddictApplicationManager<OpenIddictApplication> _applicationManager;
        private readonly IOptions<IdentityOptions> _identityOptions;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(
            OpenIddictApplicationManager<OpenIddictApplication> applicationManager,
            IOptions<IdentityOptions> identityOptions,
            SignInManager<ApplicationUser> signInManager,
            UserManager<ApplicationUser> userManager)
        {
            _applicationManager = applicationManager;
            _identityOptions = identityOptions;
            _signInManager = signInManager;
            _userManager = userManager;
        }

        #region Password, authorization code and refresh token code

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email, FirstName = model.FirstName, LastName = model.LastName };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                    return Ok();
                AddErrors(result);
            }

            //_userManager.UpdateAsync(user)

            return BadRequest(ModelState);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ChangeUser([FromBody] RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _userManager.FindByEmailAsync(model.Email).Result;
                if (user != null)
                {
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                }
                var resultUser = await _userManager.UpdateAsync(user);
                await _userManager.RemovePasswordAsync(user);
                var resultPass = await _userManager.AddPasswordAsync(user, model.Password);
                if (resultUser.Succeeded && resultPass.Succeeded)
                    return Ok();
                AddErrors(resultUser);
                AddErrors(resultPass);
            }

            return BadRequest(ModelState);
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
                ModelState.AddModelError(string.Empty, error.Description);
        }

        [HttpPost("account/token"), Produces("application/json")]
        public async Task<IActionResult> Token(OpenIdConnectRequest request)
        {
            if (request.IsPasswordGrantType())
            {
                var user = await _userManager.FindByEmailAsync(request.Username);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The username/password couple is invalid"
                    });
                }

                if (!await _signInManager.CanSignInAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The specified user is not allowed to sign in"
                    });
                }

                if (_userManager.SupportsUserLockout && await _userManager.IsLockedOutAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "This user has exceeded max number of sign in attemps"
                    });
                }

                if (!await _userManager.CheckPasswordAsync(user, request.Password))
                {
                    if (_userManager.SupportsUserLockout)
                    {
                        await _userManager.AccessFailedAsync(user);
                    }

                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "The username/password couple is invalid"
                    });
                }

                if (_userManager.SupportsUserLockout)
                {
                    await _userManager.ResetAccessFailedCountAsync(user);
                }

                var ticket = await CreateTicketAsync(request, user);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }
            else if (request.IsAuthorizationCodeGrantType() || request.IsRefreshTokenGrantType())
            {
                var info = await HttpContext.Authentication.GetAuthenticateInfoAsync(
                    OpenIdConnectServerDefaults.AuthenticationScheme);

                var user = await _userManager.GetUserAsync(info.Principal);
                if (user == null)
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "Token is no longer valid"
                    });
                }

                if(!await _signInManager.CanSignInAsync(user))
                {
                    return BadRequest(new OpenIdConnectResponse
                    {
                        Error = OpenIdConnectConstants.Errors.InvalidGrant,
                        ErrorDescription = "This user is no longer allowed to sign in"
                    });
                }

                var ticket = await CreateTicketAsync(request, user, info.Properties);

                return SignIn(ticket.Principal, ticket.Properties, ticket.AuthenticationScheme);
            }

            return BadRequest(new OpenIdConnectResponse
            {
                Error = OpenIdConnectConstants.Errors.UnsupportedGrantType,
                ErrorDescription = "Specified grant type is not supported"
            });
        }

        #endregion

        private async Task<AuthenticationTicket> CreateTicketAsync(
            OpenIdConnectRequest request, ApplicationUser user,
            AuthenticationProperties properties = null)
        {
            var principal = await _signInManager.CreateUserPrincipalAsync(user);
            var ticket = new AuthenticationTicket(principal, properties, 
                OpenIdConnectServerDefaults.AuthenticationScheme);
            
            if (!request.IsAuthorizationCodeGrantType() && !request.IsRefreshTokenGrantType())
            {
                ticket.SetScopes(new[]
                {
                    OpenIdConnectConstants.Scopes.OpenId,
                    OpenIdConnectConstants.Scopes.Email,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.Profile,
                    OpenIdConnectConstants.Scopes.OfflineAccess,
                    OpenIddictConstants.Scopes.Roles
                }.Intersect(request.GetScopes()));
            }

            ticket.SetResources("resource_server");

            foreach (var claim in ticket.Principal.Claims)
            {
                if (claim.Type == _identityOptions.Value.ClaimsIdentity.SecurityStampClaimType)
                {
                    continue;
                }

                var destinations = new List<string>
                {
                    OpenIdConnectConstants.Destinations.AccessToken
                };

                if ((claim.Type == OpenIdConnectConstants.Claims.Name && ticket.HasScope(OpenIdConnectConstants.Scopes.Profile)) ||
                    (claim.Type == OpenIdConnectConstants.Claims.Email && ticket.HasScope(OpenIdConnectConstants.Scopes.Email)) ||
                    (claim.Type == OpenIddictConstants.Claims.Roles && ticket.HasScope(OpenIddictConstants.Claims.Roles)))
                {
                    destinations.Add(OpenIdConnectConstants.Destinations.IdentityToken);   
                }
                
                claim.SetDestinations(destinations);
            }
            
            return ticket;
        }

        public IActionResult Login(string url)
        {
            return Json(new { status = "error", error = "not authentificated" });
        }
    }
}
