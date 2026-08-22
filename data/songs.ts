
export interface Song {
  youtubeId: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
}

export const songs: Song[] = [
  {
    youtubeId: "rTuxUAuRyY",
    title: "Tera Hone Laga Hoon",
    artist: "Atif Aslam",
    album: "Ajab Prem Ki Ghazab Kahani",
    year: 2009,
  },
];