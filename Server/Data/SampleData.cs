using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using FBK.Site.Models;

namespace FBK.Site.Data
{
    public class SampleData
    {
        public static void Initialize (IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetService<ApplicationDbContext>();

            if (!context.Settings.Any())
            {
                context.Settings.Add(new FBKSetting { ID = 0, Class = "reel", Name = "videoURL", Value = "/media/__2_reel_edit_v004.mp4" });
                context.Settings.Add(new FBKSetting { ID = 0, Class = "reel", Name = "videoURL", Value = "/media/reel_logo.png" });
                context.SaveChanges();
            }

            /*if (!context.Portfolio.Any())
            {
                context.Portfolio.AddRange(
                    new FBKPortfolioElement { ID = "Attraction", Year = 2017, BannerURL = "https://st.kp.yandex.net/im/poster/2/7/9/kinopoisk.ru-Prityazhenie-2791801.jpg", Description = "<h2>Attraction(2017)</h2>", Order = 0 },
                    new FBKPortfolioElement { ID = "Love with restrictions", Year = 2016, BannerURL = "https://st.kp.yandex.net/im/poster/2/6/1/kinopoisk.ru-Lubov-s-ogranicheniyami-2611466.jpg", Description = "<h2>Love with restrictions(2016)</h2>", Order = 0 },
                    new FBKPortfolioElement { ID = "Duelist", Year = 2016, BannerURL = "https://st.kp.yandex.net/im/poster/2/7/8/kinopoisk.ru-Duelyant-2788540.jpg", Description = "<h2>Duelist(2016)</h2>", Order = 1 },
                    new FBKPortfolioElement { ID = "Diggers", Year = 2016, BannerURL = "https://st.kp.yandex.net/im/poster/2/7/2/kinopoisk.ru-Diggery-2720860.jpg", Description = "<h2>Diggers(2016)</h2>", Order = 0 },
                    new FBKPortfolioElement { ID = "Night guards", Year = 2016, BannerURL = "https://st.kp.yandex.net/im/poster/2/7/8/kinopoisk.ru-Nochnye-strazhi-2786492.jpg", Description = "<h2>Night guards(2016)</h2>", Order = 0 }
                );
                context.SaveChanges();
            }*/

            if (!context.Services.Any())
            {
                context.Services.AddRange(
                    new FBKService { ID = "rotoscoping", Description = "<p>A waterfall of long waving hair looks beautiful… until you have to separate them from the background! When semi-automated methods fail, a team of rotoscopers comes in – cutting out hair by hair, frame by frame… Sounds terrifying? Not for us! Hair, snowflakes, rain drops, black cats in dark rooms – we’ve cut them out without count.</p><p>As a result, you get rendered hard mattes and software scripts/splines (upon request).</p>" },
                    new FBKService { ID = "cleanup", Description = "<p>Tons of unwanted things are being removed from thousands of frames on a daily basis, no matter if it's a feature film, a music video or a commercial. Wires, rigs, lights, people, you name it… You want us to remove a tattoo from the actor’s skin? No problem! Oh, now you want to replace the tattoo? No problem either - check out the Compositing tab J.</p><p>As a result, you get rendered clean plates or patches to use them in further work.</p>" },
                    new FBKService { ID = "compositing", Description = "<p>Compositing rules. Being one of the final and the most complex stages of postproduction, compositing can either save or ruin the whole show. That’s why we do it with utmost attention and at the best of our expertise and skills. Will the composite look natural or cartoony? With us, you’re out of options: natural, clean and seamless.</p>" },
                    new FBKService { ID = "matte painting", Description = "<p>While rendered 3D scenes and layouts may look really breathtaking. We do believe that 3D is excessive and unnecessary for the most part of shots, and good old 2D mattes can fit in just right – in terms of time and budget. As for the breathtaking effect, our artistic taste, creativeness and technique will definitely take yours away.</p><p>As a result, you get JPG previews and PSD files with separate layers.</p>" },
                    new FBKService { ID = "chroma keying", Description = "<p>Green screen is a saving straw of the modern film shooting process. The corner stone for TV news and weather forecasts. Alpha and omega of the VFX industry. We know everything about it, and we do it right and neat – without spills or artifacts.</p>" },
                    new FBKService { ID = "beauty enhancements", Description = "<p>Beauty enhancement is not a separate computer graphics process. There are no such operations in computer software as “Clear skin”, “Remove the second chin”, “Emphasize eyes” or anything like this. Actually, it is a complex result of cleanup, roto, CG compositing and more. Why then make a separate tab about it? Because some of you don’t care about “cleanups” or “roto”. All you want to know is if we can do anything to make people on the picture look better. And the answer is - yes, we can!</p>" }
                );
                context.SaveChanges();
            }

        }
    }
}
