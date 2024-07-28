import Pocketbase from "pocketbase";

export async function connectToPB() {
  const pb = new Pocketbase("https://db-word.arinji.com/");
  const adminEmail = process.env.WORD_PB_EMAIL!;
  const adminPassword = process.env.WORD_PB_PASSWORD!;
  await pb.admins.authWithPassword(adminEmail, adminPassword);
  pb.autoCancellation(false);
  await pb.admins.authRefresh();

  return pb;
}
