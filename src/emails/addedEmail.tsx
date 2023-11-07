import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { AddedToQueue } from "./templates/added-to-queue";
import * as React from "react";
import dotenv from "dotenv";
dotenv.config();

export async function SendAddedToQueueEmail(isPrem: boolean, email: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailHtml = render(<AddedToQueue isPrem={isPrem} />);

  const options = {
    from: "no-reply@vibeify.xyz",
    to: email,
    subject: "Your Convert Request Has Been Added to the Queue.",
    html: emailHtml,
  };

  const res = await transporter.sendMail(options);
}
