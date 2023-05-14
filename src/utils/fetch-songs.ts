import { groupBy, uniqBy } from "lodash";
import ArcadeSongData from "../../data.json";
import { getOverrideVersion } from "./version-override";

export const SONG_ALIAS: Record<string, string> = {
  "D✪N’T ST✪P R✪CKIN’": "D✪N’T  ST✪P  R✪CKIN’",
};

export const ARCADE_SONG_DATA = ArcadeSongData.songs as Song[];
export const ARCADE_SONGS_VERSION_DATA = ArcadeSongData.versions as Version[];

export const INTERNATIONAL_AVALIABLE_SONG = ARCADE_SONG_DATA.filter((song) => {
  return song.sheets.some((sheet) => sheet.regions.intl);
});

export const ALL_CHARTS = INTERNATIONAL_AVALIABLE_SONG.flatMap((song) => {
  return song.sheets.map((sheet) => ({
    ...song,
    ...sheet,
    title: SONG_ALIAS[song.title] || song.title,
    sheets: undefined,
  }));
}).map((i) => ({
  ...i,
  version: getOverrideVersion(i),
}));

export const CHART_BY_VERSION = groupBy(ALL_CHARTS, "version");

export const SONG_BY_VERSION = Object.fromEntries(
  Object.entries(CHART_BY_VERSION).map((i) => [i[0], uniqBy(i[1], "title")])
);

export type Version = { version: string; abbr: string };

export type Song = {
  songId: string;
  category: string;
  title: string;
  artist: string;
  bpm: number;
  imageName: string;
  version: string;
  releaseDate: string;
  isNew: boolean;
  isLocked: boolean;
  sheets: Sheet[];
};

export type Sheet = {
  type: string;
  difficulty: string;
  level: string;
  levelValue: number;
  internalLevel: string;
  internalLevelValue: number;
  noteDesigner: string;
  noteCounts: {
    tap: number;
    hold: number;
    slide: number;
    touch: number;
    break: number;
    total: number;
  };
  regions: {
    jp: boolean;
    intl: boolean;
    cn: boolean;
  };
  version: string;
};

export type Chart = Omit<Song & Sheet, "sheets">;
