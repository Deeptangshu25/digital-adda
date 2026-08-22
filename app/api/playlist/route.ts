import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_API_URL =
  "https://www.googleapis.com/youtube/v3/playlistItems";

export async function GET(
  request: NextRequest
) {
  try {
    // =====================================================
    // ENVIRONMENT
    // =====================================================

    const apiKey =
      process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "YouTube API key is missing.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // PLAYLIST ID
    // =====================================================

    const requestedPlaylistId =
      request.nextUrl.searchParams.get(
        "playlistId"
      );

    const playlistId =
      requestedPlaylistId ||
      process.env.YOUTUBE_PLAYLIST_ID;

    if (!playlistId) {
      return NextResponse.json(
        {
          error:
            "YouTube playlist ID is missing.",
        },
        { status: 400 }
      );
    }

    console.log(
      "Loading playlist:",
      playlistId
    );

    // =====================================================
    // SONGS
    // =====================================================

    const songs: {
      videoId: string;
      title: string;
      channel: string;
      position: number;
    }[] = [];

    let pageToken:
      | string
      | undefined;

    // =====================================================
    // PAGINATION
    // =====================================================

    do {
      const params =
        new URLSearchParams();

      params.set(
        "part",
        "snippet,contentDetails"
      );

      params.set(
        "playlistId",
        playlistId
      );

      params.set(
        "maxResults",
        "50"
      );

      params.set(
        "key",
        apiKey
      );

      if (pageToken) {
        params.set(
          "pageToken",
          pageToken
        );
      }

      // ===================================================
      // YOUTUBE REQUEST
      // ===================================================

      const response =
        await fetch(
          `${YOUTUBE_API_URL}?${params.toString()}`,
          {
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      // ===================================================
      // HANDLE YOUTUBE ERROR
      // ===================================================

      if (!response.ok) {
        console.error(
          "YouTube API failed:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        return NextResponse.json(
          {
            error:
              "YouTube API request failed.",

            playlistId,

            status:
              response.status,

            youtubeError:
              data?.error ?? data,
          },
          {
            status:
              response.status,
          }
        );
      }

      // ===================================================
      // EXTRACT SONGS
      // ===================================================

      for (
        const item of
          data.items ?? []
      ) {
        const videoId =
          item.snippet
            ?.resourceId
            ?.videoId;

        if (!videoId) {
          continue;
        }

        songs.push({
          videoId,

          title:
            item.snippet?.title ??
            "Unknown Song",

          channel:
            item.snippet
              ?.videoOwnerChannelTitle ??
            "YouTube",

          position:
            item.snippet?.position ??
            songs.length,
        });
      }

      pageToken =
        data.nextPageToken;

    } while (pageToken);

    // =====================================================
    // SUCCESS
    // =====================================================

    console.log(
      `Loaded ${songs.length} songs from ${playlistId}`
    );

    return NextResponse.json({
      playlistId,

      totalSongs:
        songs.length,

      songs,
    });

  } catch (error) {
    console.error(
      "Playlist API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load YouTube playlist.",

        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}