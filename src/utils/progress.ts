import {
  ChartType,
  ComboStatus,
  Difficulty,
  Score,
  SyncStatus,
} from "../../client-scripts/utils/fetch-score";

export interface ChartProgress {
  fc: boolean[];
  ap: boolean[];
  fdx: boolean[];
}

export function getProgress(title: string, type: ChartType, data: Score[]) {
  const scores = data.filter((i) => i.name === title && i.dx === type);

  const scoreMap = new Map<Difficulty, Score>(
    scores.map((i) => [i.difficulty!, i])
  );

  return {
    fc: getFcProgress(scoreMap),
    ap: getApProgress(scoreMap),
    fdx: getFdxProgress(scoreMap),
  };
}

export function getFcProgress(score: Map<Difficulty, Score>) {
  return [
    Difficulty.BASIC,
    Difficulty.ADVANCED,
    Difficulty.EXPERT,
    Difficulty.MASTER,
  ].map((i) => (score.get(i)?.comboStatus ?? 0) > ComboStatus.None);
}

export function getApProgress(score: Map<Difficulty, Score>) {
  return [
    Difficulty.BASIC,
    Difficulty.ADVANCED,
    Difficulty.EXPERT,
    Difficulty.MASTER,
  ].map((i) => (score.get(i)?.comboStatus ?? 0) >= ComboStatus.AllPerfect);
}

export function getFdxProgress(score: Map<Difficulty, Score>) {
  return [
    Difficulty.BASIC,
    Difficulty.ADVANCED,
    Difficulty.EXPERT,
    Difficulty.MASTER,
  ].map((i) => (score.get(i)?.syncStatus ?? 0) >= SyncStatus.FullSyncDx);
}
