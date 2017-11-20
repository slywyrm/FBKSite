using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBK.Site.Models
{
    public class FBKService
    {
        public string ID { get; set; }
        public string Description { get; set; }
        //public string IconFA {get; set; } = "";
        public string IconURL { get; set; } = "";
        public string IconStaticURL { get; set; }
        public string BgColor { get; set; }
        public string TextColor { get; set; }
        public int Order { get; set; }
    }
}
