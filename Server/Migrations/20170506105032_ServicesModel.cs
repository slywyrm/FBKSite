using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FBKSiteAngular.Migrations
{
    public partial class ServicesModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IconFA",
                table: "Services",
                newName: "TextColor");

            migrationBuilder.AddColumn<string>(
                name: "BGColor",
                table: "Services",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "IconStaticURL",
                table: "Services",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Services",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TextColor",
                table: "Services",
                newName: "IconFA");

            migrationBuilder.DropColumn(
                name: "BGColor",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "IconStaticURL",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Services");
        }
    }
}
