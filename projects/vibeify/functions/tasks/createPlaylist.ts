import type { Playlist } from "@spotify/web-api-ts-sdk";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import Pocketbase from "pocketbase";
import type { AddNewTask, GenreArrays } from "../../types.ts";
import { getSpotify, getSpotifyPlaylist } from "../getSpotify.ts";

type ReturnProps = {
  name: string;
  url: string;
};
export async function CreatePlaylists(
  genreArrays: GenreArrays,
  pb: Pocketbase,
  task: AddNewTask
) {
  try {
    const user = pb.authStore.model!;
    const spotify = await getSpotify();
    const { playlist } = await getSpotifyPlaylist({
      url: task.spotifyURL,
      isPrem: user.isPrem,
    });

    const createdPlaylists = await Promise.all(
      task.genres.map((genre) =>
        CreateGenrePlaylist(genre, genreArrays, spotify, playlist)
      )
    );

    const returnPlaylists: ReturnProps[] = [];
    const playlistIDS: string[] = [];
    createdPlaylists.forEach((playlist) => {
      if (playlist) {
        returnPlaylists.push({
          name: playlist.name,
          url: playlist.external_urls.spotify,
        });
        playlistIDS.push(playlist.id);
      }
    });

    return { returnPlaylists, playlistIDS };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

async function CreateGenrePlaylist(
  genre: string,
  genreArrays: GenreArrays,
  spotify: SpotifyApi,
  playlist: Playlist
) {
  if (genreArrays[genre.toLowerCase()].length > 0) {
    const date = new Date();
    const currentDate = `${date.getDate()}-${
      date.getMonth() + 1
    }-${date.getFullYear()}`;
    const createdPlaylist = await spotify.playlists.createPlaylist(
      process.env.SPOTIFY_ID!,
      {
        name: `${playlist.name} - ${genre} - ${currentDate}`,
        public: true,
      }
    );

    const arrayURIS = genreArrays[genre.toLowerCase()].map(
      (track) => track.uri
    );

    await spotify.playlists.addItemsToPlaylist(createdPlaylist.id, arrayURIS);

    return createdPlaylist;
  }
}
