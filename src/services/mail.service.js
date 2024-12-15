import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

async function sendMail(mailOptions) {
  transporter.sendMail(
    { from: `"Coffeeholic" welcome@coffeeholic.com`, ...mailOptions },
    (error, info) => {
      if (error) {
        return console.error(`Error: ${error}`);
      }
      console.log(`Message sent: ${info.messageId}`);
    }
  );
}

export default { sendMail };
