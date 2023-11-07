import { AddNewTask } from "../types.js";
import { SendAddedToQueueEmail } from "./emails/addedEmail.js";
import { SendQueueErrorEmail } from "./emails/errorEmail.js";
import { SendTaskFinishEmail } from "./emails/finishedEmail.js";
import { getSpotifyPlaylist } from "./getSpotify.js";
import { CreatePlaylists } from "./tasks/createPlaylist.js";
import { FinishTask } from "./tasks/finishTask.js";
import GetGenre from "./tasks/getGenre.js";

import ValidateUser, { CheckForLimit } from "./tasks/validateUser.js";

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
