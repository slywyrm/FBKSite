using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FBKSiteAngular.Migrations
{
    public partial class PortfolioUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Portfolio");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Portfolio",
                columns: table => new
                {
                    ID = table.Column<string>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    BannerURL = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Order = table.Column<int>(nullable: false),
                    VideoURL = table.Column<string>(nullable: true),
                    Year = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Portfolio", x => x.ID);
                });
        }
    }
}
