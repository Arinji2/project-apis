import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { FinishedFromQueue } from "./templates/finished-from-queue.js";
import * as React from "react";
import dotenv from "dotenv";

dotenv.config();
type LinkProps = {
  name: string;
  url: string;
};
export async function SendTaskFinishEmail(
  playlists: LinkProps[],
  isPrem: boolean,
  uses: number,
  email: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailHtml = render(
    <FinishedFromQueue isPrem={isPrem} links={playlists} uses={uses} />
  );

  const options = {
    from: "no-reply@vibeify.xyz",
    to: email,
    subject: "Your Convert Request Has Completed.",
    html: emailHtml,
  };

  const res = await transporter.sendMail(options);
}
