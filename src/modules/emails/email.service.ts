import nodemailer from "nodemailer";
import { config } from "../../config";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      secure: true,
      port: 465,
      auth: {
        user: "resend",
        pass: config.RESEND_API_KEY,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = `${config.WEB_CLIENT_URL}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: config.RESEND_EMAIL_FROM,
      to,
      subject: "Verify your email address",
      html: `
        <div>
          <h1>Welcome to ${config.APP_NAME}!</h1>
          <p>Please click the link below to verify your email address:</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </div>
      `,
    });
  }
}

export const emailService = new EmailService();
