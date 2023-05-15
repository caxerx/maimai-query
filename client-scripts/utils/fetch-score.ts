import { fetchPage } from "./fetch";

export const enum Difficulty {
  BASIC = 0,
  ADVANCED = 1,
  EXPERT = 2,
  MASTER = 3,
  ReMASTER = 4,
}

export const DIFFICULTY_COLOR = new Map([
  [Difficulty.ReMASTER, "#dbaaff"],
  [Difficulty.MASTER, "#9f51dc"],
  [Difficulty.EXPERT, "#ff7b7b"],
  [Difficulty.ADVANCED, "#ffba01"],
  [Difficulty.BASIC, "#45c124"],
]);

export const DIFFICULTIES = [
  "BASIC",
  "ADVANCED",
  "EXPERT",
  "MASTER",
  "Re:MASTER",
];

export const DIFFICULTY_CLASSNAME_MAP = new Map([
  ["Re:MASTER", "remaster"],
  ["MASTER", "master"],
  ["EXPERT", "expert"],
  ["ADVANCED", "advanced"],
]);

export const SELF_SCORE_URLS = new Map([
  [
    Difficulty.ReMASTER,
    "/maimai-mobile/record/musicGenre/search/?genre=99&diff=4",
  ],
  [
    Difficulty.MASTER,
    "/maimai-mobile/record/musicGenre/search/?genre=99&diff=3",
  ],
  [
    Difficulty.EXPERT,
    "/maimai-mobile/record/musicGenre/search/?genre=99&diff=2",
  ],
  [
    Difficulty.ADVANCED,
    "/maimai-mobile/record/musicGenre/search/?genre=99&diff=1",
  ],
  [
    Difficulty.BASIC,
    "/maimai-mobile/record/musicGenre/search/?genre=99&diff=0",
  ],
]);

export function mapCurrentCategory(netCategory: string) {
  const categoryMapping: Record<string, string> = {
    "POPS＆ANIME": "POPS＆アニメ",
    "niconico＆VOCALOID™": "niconico＆ボーカロイド",
    "GAME＆VARIETY": "ゲーム＆バラエティ",
  };
  return categoryMapping[netCategory] ?? netCategory;
}

export async function fetchScore(difficulty: Difficulty) {
  const dom = await fetchPage(SELF_SCORE_URLS.get(difficulty) as string);
  return dom;
}

export const enum ChartType {
  STANDARD = 0,
  DX = 1,
}

export function getChartType(row: HTMLElement): ChartType {
  if (row.id) {
    // for multi-ChartType songs in song list
    return row.id.includes("sta_") ? ChartType.STANDARD : ChartType.DX;
  }
  const chartTypeImg =
    row.querySelector(".playlog_music_kind_icon") || // for single and all play records
    row.querySelector(".music_kind_icon") || // for song list and friend vs
    row.querySelector(".f_l.h_20") || // for song detail page
    row.querySelector("img:nth-child(2)"); // ancient wisdom for song list

  if (!(chartTypeImg instanceof HTMLImageElement)) {
    return ChartType.DX;
  }
  return chartTypeImg.src.includes("_standard")
    ? ChartType.STANDARD
    : ChartType.DX;
}

export function getSongName(row: HTMLElement) {
  const playRecordSongNameElem = row.querySelector(
    ".basic_block.break"
  ) as HTMLElement;
  if (playRecordSongNameElem) {
    // There can be 1 or 2 childNodes depending on whether "CLEAR!" image exists.
    // If "CLEAR!" image exists, it will be the first childNode.
    // Therefore, we always retrieve song name from the last childNode.
    return playRecordSongNameElem.childNodes.item(
      playRecordSongNameElem.childNodes.length - 1
    ).nodeValue;
  }
  return (row.getElementsByClassName("music_name_block")[0] as HTMLElement)
    .innerText;
}

export function getSongAchievement(row: HTMLElement): number {
  const achievementElem = row.querySelector(
    ".music_score_block"
  ) as HTMLElement;

  if (achievementElem) {
    return +(Number.parseFloat(achievementElem.innerText) * 10000).toFixed(0);
  }
  return 0;
}

export enum ComboStatus {
  None,
  FullCombo,
  FullComboPlus,
  AllPerfect,
  AllPerfectPlus,
}

export enum SyncStatus {
  None,
  FullSync,
  FullSyncPlus,
  FullSyncDx,
  FullSyncDxPlus,
}

export function getComboSyncStatus(row: HTMLElement): {
  comboStatus: ComboStatus;
  syncStatus: SyncStatus;
} {
  const circleBadgeList = row.querySelectorAll(".h_30.f_r");

  let comboStatus = ComboStatus.None;
  let syncStatus = SyncStatus.None;

  circleBadgeList.forEach((circleBadge) => {
    if (circleBadge instanceof HTMLImageElement) {
      if (circleBadge.src.includes("music_icon_fc.png")) {
        comboStatus = ComboStatus.FullCombo;
      }

      if (circleBadge.src.includes("music_icon_fcp.png")) {
        comboStatus = ComboStatus.FullComboPlus;
      }

      if (circleBadge.src.includes("music_icon_ap.png")) {
        comboStatus = ComboStatus.AllPerfect;
      }

      if (circleBadge.src.includes("music_icon_app.png")) {
        comboStatus = ComboStatus.AllPerfectPlus;
      }

      if (circleBadge.src.includes("music_icon_fs.png")) {
        syncStatus = SyncStatus.FullSync;
      }

      if (circleBadge.src.includes("music_icon_fsp.png")) {
        syncStatus = SyncStatus.FullSyncPlus;
      }

      if (circleBadge.src.includes("music_icon_fsd.png")) {
        syncStatus = SyncStatus.FullSyncDx;
      }

      if (circleBadge.src.includes("music_icon_fsdp.png")) {
        syncStatus = SyncStatus.FullSyncDxPlus;
      }
    }
  });

  return {
    comboStatus,
    syncStatus,
  };
}

export async function parseSongList(
  dom: Document,
  difficulty?: Difficulty
): Promise<Score[]> {
  const rows = Array.from(
    dom.querySelectorAll(
      ".w_450.m_15.f_0, .screw_block.m_15.f_15.scroll_point"
    ) as NodeListOf<HTMLElement>
  );

  let currentCategory = "";
  const scores: Score[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.querySelector("div")) {
      currentCategory = mapCurrentCategory(row.innerText);
      continue;
    }
    scores.push({
      name: getSongName(row)!,
      dx: getChartType(row),
      achivement: getSongAchievement(row),
      ...getComboSyncStatus(row),
      difficulty,
      category: currentCategory,
    });
  }

  return scores;
}

export interface Score {
  name: string;
  dx: ChartType;
  achivement: number;
  comboStatus: ComboStatus;
  syncStatus: SyncStatus;
  category: string;
  difficulty?: Difficulty;
}
