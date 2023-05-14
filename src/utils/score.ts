import { ChartType, Score } from "../../client-scripts/utils/fetch-score";
import { ARCADE_SONG_DATA } from "./fetch-songs";

export interface ScoreByVersion extends Score {
  version: string;
}

export function getDifficulty(difficultyString: string) {
  if (difficultyString === "basic") {
    return 0;
  }

  if (difficultyString === "advanced") {
    return 1;
  }

  if (difficultyString === "expert") {
    return 2;
  }

  if (difficultyString === "master") {
    return 3;
  }

  if (difficultyString === "remaster") {
    return 4;
  }
}

export function getChartType(type: string) {
  return type === "dx" ? ChartType.DX : ChartType.STANDARD;
}

// function mapScoreToVersion(score: Score): ScoreByVersion {
//   return {
//     ...score,
//     version: ARCADE_SONG_DATA.find((song) => song.title === score.name),
//   };
// }

// function groupScoreByVersion(scores: Score[]) {}
