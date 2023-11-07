/*TASKS

1. Add +1 to uses
2. Add to db for deletion

*/
import Pocketbase from "pocketbase";

export async function FinishTask(
  pb: Pocketbase,
  spotifyIDS: string[],
  uses: number,
  usesID: string
) {
  await UpdateUses(pb, uses, usesID);
  await AddForDeletion(pb, spotifyIDS);
}

async function UpdateUses(pb: Pocketbase, uses: number, usesID: string) {
  const user = pb.authStore.model!;

  await pb.collection("convertLimit").update(usesID, {
    uses: uses + 1,
  });
}

async function AddForDeletion(pb: Pocketbase, spotifyIDS: string[]) {
  const user = pb.authStore.model!;
  pb.autoCancellation(false);
  const date = new Date();

  if (user.isPrem) date.setHours(date.getHours() + 50);
  else date.setHours(date.getHours() + 24);
  spotifyIDS.forEach(async (id) => {
    await pb.collection("convertDeletion").create({
      playlistID: id,
      toBeDeleted: date,
    });
  });
}
