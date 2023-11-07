import { SpotifyApi, Track } from "@spotify/web-api-ts-sdk";
import dotenv from "dotenv";

dotenv.config();
export async function getSpotify() {
  const res = await refreshTokenHandler(
    process.env.SPOTIFY_REFRESH_TOKEN!,
    process.env.SPOTIFY_CLIENT_ID!,
    process.env.SPOTIFY_CLIENT_SECRET!
  );
  if (res.access_token) {
    return SpotifyApi.withAccessToken(process.env.SPOTIFY_CLIENT_ID!, res);
  } else throw new Error("No access token");
}
async function refreshTokenHandler(
  refresh_token: string,
  client_id: string,
  client_secret: string
) {
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        //@ts-expect-error
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  };

  const res = await fetch(authOptions.url, {
    method: "POST",
    headers: authOptions.headers,
    body: authOptions.body,
  });
  return res.json();
}

export async function getSpotifyPlaylist({
  url,
  isPrem,
}: {
  url: string;
  isPrem: boolean;
}) {
  try {
    const playlistID = url.split("/")[4].split("?")[0];
    const spotify = await getSpotify();
    const playlist = await spotify.playlists.getPlaylist(playlistID);

    let playlistTracks = playlist.tracks.items;

    if (playlist.tracks.items.length > 200 && !isPrem)
      throw new Error(
        "Playlist is too large. Maximum of 200 songs allowed for Free Users."
      );
    else if (playlist.tracks.items.length > 400)
      throw new Error(
        "Playlist is too large. Maximum of 400 songs allowed for Premium Users."
      );

    if (playlist.tracks.next !== null) {
      const next50 = await spotify.playlists.getPlaylistItems(
        playlistID,
        undefined,
        undefined,
        50,
        100
      );
      const next100 = await spotify.playlists.getPlaylistItems(
        playlistID,
        undefined,
        undefined,
        50,
        150
      );
      const total = next50.items.concat(next100.items);
      playlistTracks.concat(total);
    }

    const formattedTracks = playlistTracks.map((track) => {
      if ((track.track as Track).artists) {
        return track.track as unknown as Track;
      } else throw new Error("Invalid Spotify URL");
    });

    return { playlist, formattedTracks };
  } catch (error) {
    throw new Error("Invalid Spotify URL");
  }
}
export async function getNext100({ url }: { url: string }) {
  try {
    const playlistID = url.split("/")[4].split("?")[0];
    const spotify = await getSpotify();
    const next50 = await spotify.playlists.getPlaylistItems(
      playlistID,
      undefined,
      undefined,
      50,
      100
    );
    const next100 = await spotify.playlists.getPlaylistItems(
      playlistID,
      undefined,
      undefined,
      50,
      150
    );
    const total = next50.items.concat(next100.items);

    return total;
  } catch (error) {
    throw new Error("Invalid Spotify URL");
  }
}
