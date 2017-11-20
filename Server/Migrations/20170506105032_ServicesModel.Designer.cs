using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using FBK.Site.Data;

namespace FBKSiteAngular.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20170506105032_ServicesModel")]
    partial class ServicesModel
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.1");

            modelBuilder.Entity("FBK.Site.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasMaxLength(256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<string>("FirstName");

                    b.Property<string>("LastName");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("FBK.Site.Models.FBKContact", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Email");

                    b.Property<string>("Message");

                    b.Property<string>("Name");

                    b.Property<string>("Subject");

                    b.HasKey("ID");

                    b.ToTable("Contacts");
                });

            modelBuilder.Entity("FBK.Site.Models.FBKPortfolioElement", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Banner");

                    b.Property<string>("Description");

                    b.Property<string>("Director");

                    b.Property<string>("Facebook");

                    b.Property<string>("Imdb");

                    b.Property<string>("Kinopoisk");

                    b.Property<string>("Name");

                    b.Property<string>("Operator");

                    b.Property<int>("Order");

                    b.Property<string>("Production");

                    b.Property<DateTime>("ProductionEnd");

                    b.Property<DateTime>("ProductionStart");

                    b.Property<string>("RottenTomatoes");

                    b.Property<int>("ShotsNumber");

                    b.Property<float>("StillAspectRatio");

                    b.Property<string>("Twitter");

                    b.Property<string>("Vkontakte");

                    b.Property<int>("Year");

                    b.HasKey("ID");

                    b.ToTable("Portfolio");
                });

            modelBuilder.Entity("FBK.Site.Models.FBKService", b =>
                {
                    b.Property<string>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("BGColor");

                    b.Property<string>("Description");

                    b.Property<string>("IconStaticURL");

                    b.Property<string>("IconURL");

                    b.Property<int>("Order");

                    b.Property<string>("TextColor");

                    b.HasKey("ID");

                    b.ToTable("Services");
                });

            modelBuilder.Entity("FBK.Site.Models.FBKSetting", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Class");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("ID");

                    b.ToTable("Settings");
                });

            modelBuilder.Entity("FBK.Site.Models.MovieStill", b =>
                {
                    b.Property<int>("ID")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("FBKPortfolioElementID");

                    b.Property<string>("Image");

                    b.Property<int>("Order");

                    b.HasKey("ID");

                    b.HasIndex("FBKPortfolioElementID");

                    b.ToTable("MovieStillls");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasMaxLength(256);

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .IsUnique()
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictApplication", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClientId");

                    b.Property<string>("ClientSecret");

                    b.Property<string>("DisplayName");

                    b.Property<string>("LogoutRedirectUri");

                    b.Property<string>("RedirectUri");

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.HasIndex("ClientId")
                        .IsUnique();

                    b.ToTable("OpenIddictApplications");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictAuthorization", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationId");

                    b.Property<string>("Scope");

                    b.Property<string>("Subject");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.ToTable("OpenIddictAuthorizations");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictScope", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Description");

                    b.HasKey("Id");

                    b.ToTable("OpenIddictScopes");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictToken", b =>
                {
                    b.Property<string>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApplicationId");

                    b.Property<string>("AuthorizationId");

                    b.Property<string>("Subject");

                    b.Property<string>("Type");

                    b.HasKey("Id");

                    b.HasIndex("ApplicationId");

                    b.HasIndex("AuthorizationId");

                    b.ToTable("OpenIddictTokens");
                });

            modelBuilder.Entity("FBK.Site.Models.MovieStill", b =>
                {
                    b.HasOne("FBK.Site.Models.FBKPortfolioElement")
                        .WithMany("Stills")
                        .HasForeignKey("FBKPortfolioElementID");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("FBK.Site.Models.ApplicationUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("FBK.Site.Models.ApplicationUser")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("FBK.Site.Models.ApplicationUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictAuthorization", b =>
                {
                    b.HasOne("OpenIddict.Models.OpenIddictApplication", "Application")
                        .WithMany("Authorizations")
                        .HasForeignKey("ApplicationId");
                });

            modelBuilder.Entity("OpenIddict.Models.OpenIddictToken", b =>
                {
                    b.HasOne("OpenIddict.Models.OpenIddictApplication", "Application")
                        .WithMany("Tokens")
                        .HasForeignKey("ApplicationId");

                    b.HasOne("OpenIddict.Models.OpenIddictAuthorization", "Authorization")
                        .WithMany("Tokens")
                        .HasForeignKey("AuthorizationId");
                });
        }
    }
}
