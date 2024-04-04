import { Resend } from "resend";
import { FinishedFromQueue } from "./templates/finished-from-queue.js";

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
  const resend = new Resend(process.env.EMAIL_KEY);

  await resend.emails.send({
    from: "no-reply@mail.arinji.com",
    to: email,
    subject: "Your Convert Request Has Completed.",
    react: <FinishedFromQueue isPrem={isPrem} links={playlists} uses={uses} />,
  });
}
