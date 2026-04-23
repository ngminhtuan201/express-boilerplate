import nodemailer from "nodemailer";
import { config } from "../../config";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  secure: true,
  port: 465,
  auth: {
    user: "resend",
    pass: config.RESEND_API_KEY,
  },
});

export const sendVerificationEmail = async (
  recevier: string,
  token: string,
): Promise<void> => {
  await transporter.sendMail({
    from: config.RESEND_EMAIL_FROM,
    to: recevier,
    subject: "Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Please verify your email by clicking on the link: <a href="${config.APP_HOST}/api/auth/verify-email?token=${token}">Verify your email</a></p>
    `,
  });
};
