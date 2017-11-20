using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FBKSiteAngular.Migrations
{
    public partial class PortfolioUpdate6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "StillAspectRatio",
                table: "Portfolio",
                nullable: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "StillAspectRatio",
                table: "Portfolio",
                nullable: false);
        }
    }
}
