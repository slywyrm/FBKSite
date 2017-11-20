using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using MailKit.Security;
using FBK.Site.Data;

namespace FBK.Site.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link http://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        public async Task SendEmailAsync(string email, string subject, string message)
        {
            // Plug in your email service here to send an email.
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("FBK Site", "ps@framebakery.tv"));
            emailMessage.To.Add(new MailboxAddress("", email));
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart("plain") { Text = message };

            using (var client = new SmtpClient())
            {
                await client.ConnectAsync("smtp.yandex.ru", 465, true);
                await client.AuthenticateAsync("ps@framebakery.tv", "baDfe15790");
                try
                {
                    await client.SendAsync(emailMessage);
                }
                catch (SmtpCommandException ex)
                {
                    Console.WriteLine("Code: {0}, Message: {1}", ex.ErrorCode, ex.Message);
                } 
                finally
                {
                    await client.DisconnectAsync(true);
                }
            }
        }

        public Task SendSmsAsync(string number, string message)
        {
            // Plug in your SMS service here to send a text message.
            return Task.FromResult(0);
        }
    }
}
