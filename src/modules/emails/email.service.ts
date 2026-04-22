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
) => {
  return;
};
