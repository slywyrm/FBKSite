using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FBKSiteAngular.Migrations
{
    public partial class PortfolioUpdate4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "MovieStillls",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "MovieStillls");
        }
    }
}
