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
  sss: boolean[];
}

export function getProgress(
  title: string,
  category: string,
  type: ChartType,
  data: Score[]
) {
  const scores = data.filter(
    (i) => i.name === title && i.category === category && i.dx === type
  );

  if (scores.length === 0) return null;

  const scoreMap = new Map<Difficulty, Score>(
    scores.map((i) => [i.difficulty!, i])
  );

  return {
    fc: getFcProgress(scoreMap),
    ap: getApProgress(scoreMap),
    fdx: getFdxProgress(scoreMap),
    sss: getSssProgress(scoreMap),
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

export function getSssProgress(score: Map<Difficulty, Score>) {
  return [
    Difficulty.BASIC,
    Difficulty.ADVANCED,
    Difficulty.EXPERT,
    Difficulty.MASTER,
  ].map((i) => (score.get(i)?.achivement ?? 0) >= 1000000);
}
