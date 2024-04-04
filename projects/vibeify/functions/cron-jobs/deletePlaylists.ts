import cron from "node-cron";
import Pocketbase from "pocketbase";

import type { AccessToken } from "@spotify/web-api-ts-sdk";
import { getSpotify } from "../getSpotify.js";
export const deleteConvertsJob = cron.schedule("0 * * * *", async () => {
  const pb = new Pocketbase("https://db-listify.arinji.com");
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  await pb.admins.authWithPassword(email, password);
  const spotify = await getSpotify();
  const token = (await spotify.getAccessToken()) as AccessToken;

  const ids = await pb.collection("convertDeletion").getFullList({
    filter: `toBeDeleted < "${new Date().toISOString()}"`,
  });

  ids.forEach(async (id) => {
    await fetch(
      `https://api.spotify.com/v1/playlists/${id.playlistID}/followers`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    await pb.collection("convertDeletion").delete(id.id);
  });
});
