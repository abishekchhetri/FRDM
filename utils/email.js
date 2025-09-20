const nodemailer = require("nodemailer");
class Email {
  constructor(user, url) {
    this.url = url;
    this.firstname = user.name.split(" ")[0];
    this.email = user.email;
    this.from = "Avishek Chhetri <abiking@gmail.com>";
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
  }

  async sendMail(message, subject) {
    const mailOptions = {
      from: this.from,
      to: this.email,
      subject: subject,
      text: message, // plain‑text body
      // html: "<b>Hello world?</b>", // HTML body only when i use template
    };

    await this.transporter().sendMail(mailOptions);
  }

  async sendMessage(message, subject) {
    await this.sendMail(message, subject);
    console.log("Mail sent! to " + this.email);
  }
}

module.exports = Email;
