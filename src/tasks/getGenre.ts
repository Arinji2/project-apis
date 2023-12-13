import type { Track } from "@spotify/web-api-ts-sdk";
import Pocketbase from "pocketbase";
import { AddNewTask, GenreArrays } from "../../types.js";
import { GetGenreFromAI } from "../ai.js";
export default async function GetGenre(
  formattedTracks: Track[],
  pb: Pocketbase,
  task: AddNewTask
) {
  const genreArrays: GenreArrays = {};

  // Initialize the genre arrays
  task.genres.forEach((genre) => {
    genreArrays[genre] = [];
  });

  for (const track of formattedTracks) {
    //Check if in DB
    try {
      const songData = await pb
        .collection("songs")
        .getFirstListItem(`spotifyID = "${track.id}"`);

      let matchedGenres = task.genres.filter((genre) =>
        songData.genres.includes(genre)
      );

      if (matchedGenres.length === 0) {
        await MatchGenreWithExternals(track, pb, task, matchedGenres);

        await pb.collection("songs").update(songData.id, {
          genres: songData.genres.concat(matchedGenres),
        });
      }
      // Add to genre arrays

      matchedGenres.forEach((genre) => {
        genreArrays[genre].push({ uri: track.uri });
      });
    } catch (error) {
      let matchedGenres: string[] = [];
      await MatchGenreWithExternals(track, pb, task, matchedGenres);
      await pb.collection("songs").create({
        spotifyID: track.id,
        genres: matchedGenres,
        name: track.name,
      });
      // Add to genre arrays

      matchedGenres.forEach((genre) => {
        genreArrays[genre].push({ uri: track.uri });
      });
    }
  }

  // Return the genre-specific arrays

  return genreArrays;
}

async function MatchGenreWithExternals(
  track: Track,
  pb: Pocketbase,
  task: AddNewTask,
  matchedGenre: string[]
) {
  if (track.album.genres) {
    // Match with Spotify
    const spotify = track.album.genres.filter((genre) =>
      task.genres.includes(genre)
    );

    matchedGenre = spotify;
  }

  if (matchedGenre.length === 0) {
    // Match with AI
    const aiMatch = await GetGenreFromAI({
      songName: track.name,
      artistNames: track.artists.map((artist) => artist.name),
      genres: task.genres,
    });
    matchedGenre.push(aiMatch);
  }
}
