import Pocketbase, { ClientResponseError } from "pocketbase";

export default async function ValidateUser(userToken: string) {
  const pb = new Pocketbase("https://db-listify.arinji.com");
  pb.authStore.save(userToken);
  await pb.collection("users").authRefresh();
  if (pb.authStore.model) return { user: pb.authStore.model, pb };
  else throw new Error("Invalid User");
}

export async function CheckForLimit(pb: Pocketbase) {
  const user = pb.authStore.model!;
  try {
    const data = await pb
      .collection("convertLimit")
      .getFirstListItem(`user = "${user.id}"`);

    if (data.uses == 5 && !user.isPrem) {
      throw new Error(
        "Maximum Compare Requests of 5 per week reached. Please upgrade to Premium to continue using the service or try again next week."
      );
    }
    if (data.uses == 10 && user.isPrem)
      throw new Error(
        "Maximum Compare Requests of 10 per week reached. Please try again next week."
      );
    const uses = parseInt(data.uses);
    const usesID = data.id;
    return { uses, usesID };
  } catch (error) {
    if (error instanceof ClientResponseError) {
      const usesData = await pb.collection("convertLimit").create({
        user: user.id,
        uses: 0,
      });

      return { uses: 0, usesID: usesData.id };
    } else {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}

export async function DeleteAllConverts() {
  const pb = new Pocketbase("https://db-listify.arinji.com");
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  await pb.admins.authWithPassword(email, password);

  const ids = await pb.collection("convertLimit").getFullList();
  for (const id of ids) {
    await pb.collection("convertLimit").delete(id.id);
  }
}
