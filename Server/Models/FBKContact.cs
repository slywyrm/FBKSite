using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FBK.Site.Models
{
    public class FBKContact
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Email {get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }

        public override string ToString()
        {
            return String.Format("Sender: {0}\n Email: {1}\n Subject: {2}\n Message:{3}",
                                 this.Name, this.Email, this.Subject, this.Message);
        }
    }
}
