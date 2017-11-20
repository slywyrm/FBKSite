using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FBKSiteAngular.Migrations
{
    public partial class PortfolioUpdate1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Portfolio",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    Banner = table.Column<byte[]>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Director = table.Column<string>(nullable: true),
                    Facebook = table.Column<string>(nullable: true),
                    Imdb = table.Column<string>(nullable: true),
                    Kionpoisk = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    Operator = table.Column<string>(nullable: true),
                    Order = table.Column<int>(nullable: false),
                    Production = table.Column<string>(nullable: true),
                    ProductionEnd = table.Column<DateTime>(nullable: false),
                    ProductionStart = table.Column<DateTime>(nullable: false),
                    RottenTomatoes = table.Column<string>(nullable: true),
                    ShotsNumber = table.Column<int>(nullable: false),
                    Twitter = table.Column<string>(nullable: true),
                    Vkontakte = table.Column<string>(nullable: true),
                    Year = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Portfolio", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "MovieStillls",
                columns: table => new
                {
                    ID = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGeneratedOnAdd", true),
                    FBKPortfolioElementID = table.Column<int>(nullable: true),
                    Image = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MovieStillls", x => x.ID);
                    table.ForeignKey(
                        name: "FK_MovieStillls_Portfolio_FBKPortfolioElementID",
                        column: x => x.FBKPortfolioElementID,
                        principalTable: "Portfolio",
                        principalColumn: "ID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MovieStillls_FBKPortfolioElementID",
                table: "MovieStillls",
                column: "FBKPortfolioElementID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MovieStillls");

            migrationBuilder.DropTable(
                name: "Portfolio");
        }
    }
}
