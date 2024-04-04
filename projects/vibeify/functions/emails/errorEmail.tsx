import { Resend } from "resend";
import { ErrorFromQueue } from "./templates/error-from-queue.js";

export async function SendQueueErrorEmail(error: string, email: string) {
  const resend = new Resend(process.env.EMAIL_KEY);

  await resend.emails.send({
    from: "no-reply@mail.arinji.com",
    to: email,
    subject: "Your Convert Request Has Failed.",
    react: <ErrorFromQueue error={error} />,
  });
}
