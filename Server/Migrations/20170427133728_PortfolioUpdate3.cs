using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FBKSiteAngular.Migrations
{
    public partial class PortfolioUpdate3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Image",
                table: "MovieStillls",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Banner",
                table: "Portfolio",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "Image",
                table: "MovieStillls",
                nullable: true);

            migrationBuilder.AlterColumn<byte[]>(
                name: "Banner",
                table: "Portfolio",
                nullable: true);
        }
    }
}
