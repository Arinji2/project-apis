import { AddedToQueue } from "./templates/added-to-queue.js";

import { Resend } from "resend";

export async function SendAddedToQueueEmail(isPrem: boolean, email: string) {
  const resend = new Resend(process.env.EMAIL_KEY);

  await resend.emails.send({
    from: "no-reply@mail.arinji.com",
    to: email,
    subject: "Your Convert Request Has Been Added to the Queue.",
    react: <AddedToQueue isPrem={isPrem} />,
  });
}
