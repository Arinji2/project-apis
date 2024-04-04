import type { AddNewTask } from "../types.ts";
import { SendAddedToQueueEmail } from "./emails/addedEmail.tsx";
import { SendQueueErrorEmail } from "./emails/errorEmail.tsx";
import { SendTaskFinishEmail } from "./emails/finishedEmail.tsx";
import { getSpotifyPlaylist } from "./getSpotify.ts";
import { CreatePlaylists } from "./tasks/createPlaylist.ts";
import { FinishTask } from "./tasks/finishTask.ts";
import GetGenre from "./tasks/getGenre.ts";

import ValidateUser, { CheckForLimit } from "./tasks/validateUser.ts";

export async function performTask(taskInProgress: boolean, task: AddNewTask) {
  const { user, pb } = await ValidateUser(task.userToken);
  try {
    const usesData = await CheckForLimit(pb);
    await SendAddedToQueueEmail(user.isPrem, user.email);

    const { formattedTracks } = await getSpotifyPlaylist({
      url: task.spotifyURL,
      isPrem: user.isPrem,
    });

    const genre = await GetGenre(formattedTracks, pb, task);
    const CreatePlaylistResponse = await CreatePlaylists(genre, pb, task)!;
    await FinishTask(
      pb,
      CreatePlaylistResponse?.playlistIDS!,
      usesData?.uses!,
      usesData?.usesID!
    );
    await SendTaskFinishEmail(
      CreatePlaylistResponse?.returnPlaylists!,
      user.isPrem,
      usesData?.uses!,
      user.email
    );
    taskInProgress = false;
  } catch (error) {
    if (error instanceof Error) {
      let message = error.message;
      if (
        error.message ===
        "The request requires valid record authorization token to be set."
      )
        message = "Invalid User";

      await SendQueueErrorEmail(message, user.email);
      taskInProgress = false;
    }
  }
}
