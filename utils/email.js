const pug = require("pug");
const nodemailer = require("nodemailer");
class Email {
  constructor(user, url) {
    this.url = url;
    this.firstname = user.name.split(" ")[0];
    this.email = user.email;
    this.from = "Food recipe and diet";
  }

  transporter() {
    if (process.env.NODE_ENV === "development")
      return nodemailer.createTransport({
        host: process.env.MT_HOST,
        port: process.env.MT_PORT,
        // secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.MT_USERNAME,
          pass: process.env.MT_PASSWORD,
        },
      });
    else
      return nodemailer.createTransport({
        host: process.env.G_HOST,
        port: process.env.G_PORT,
        // secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.G_USERNAME,
          pass: process.env.G_PASSWORD,
        },
      });
  }

  async sendMail(template, message, subject) {
    //compiling html from the pug using renderFile
    try {
      const html = pug.renderFile(
        `${__dirname}/../views/email/${template}.pug`,
        {
          url: this.url,
          firstname: this.firstname,
          subject: this.subject,
        }
      );

      const mailOptions = {
        from: this.from,
        to: this.email,
        subject: subject,
        text: message, // plain‑text body
        html, // HTML body only when i use template
      };
      await this.transporter().sendMail(mailOptions);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async sendMessage(template, message, subject) {
    try {
      await this.sendMail(template, message, subject);
      console.log("Mail sent! to " + this.email);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Email;
