import { AddNewTask } from "../types";
import { SendAddedToQueueEmail } from "./emails/addedEmail";
import { SendQueueErrorEmail } from "./emails/errorEmail";
import { SendTaskFinishEmail } from "./emails/finishedEmail";
import { getSpotifyPlaylist } from "./getSpotify";
import { CreatePlaylists } from "./tasks/createPlaylist";
import { FinishTask } from "./tasks/finishTask";
import GetGenre from "./tasks/getGenre";

import ValidateUser, { CheckForLimit } from "./tasks/validateUser";

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
