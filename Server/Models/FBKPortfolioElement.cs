using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBK.Site.Models
{
    public class FBKPortfolioElement
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int Year { get; set; }
        public string Production { get; set; }
        public string Banner { get; set; }
        public string Director { get; set; }
        public string Operator { get; set; }
        public string Description { get; set; }
        public DateTime ProductionStart { get; set; }
        public DateTime ProductionEnd { get; set; }
        public int ShotsNumber { get; set; }
        public string Imdb { get; set; }
        public string RottenTomatoes { get; set; }
        public string Kinopoisk { get; set; }
        public string Facebook { get; set; }
        public string Twitter { get; set; }
        public string Vkontakte { get; set; }
        public float StillAspectRatio { get; set; }
        public virtual ICollection<MovieStill> Stills { get; set; }
        public int Order { get; set; }
    }

    public class MovieStill
    {
        public int ID { get; set; }
        public string Image { get; set; }
        public int Order { get; set; }
    }
}
