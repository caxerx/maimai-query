// export const enum ChartType {
//   STANDARD = 0,
//   DX = 1,
// }

// export interface BasicSongProps {
//   dx: ChartType;
//   name: string;
//   nickname?: string | null;
// }
// export interface SongProperties extends BasicSongProps {
//   debut: number;
//   lv: ReadonlyArray<number>;
// }

// // INTL_VER_SONG_PROPS contains songs whose International version is older than
// // JP version.
// const INTL_VER_SONG_PROPS: ReadonlyArray<SongProperties> = [
//   // BREaK! BREaK! BREaK! is debuted at SPLASH (intl), SPLASH PLUS (Jp)
//   {
//     name: "BREaK! BREaK! BREaK!",
//     dx: 1,
//     debut: 15,
//     lv: [-5, -8, 12.8, 14.7, 0],
//   },
//   // 宿星審判 is debuted at SPLASH PLUS (intl), UNiVERSE (Jp)
//   { name: "宿星審判", dx: 1, debut: 16, lv: [-4, -8, -12, 14.4, 0] },
// ];

// const INTL_VER_OVERRIDES: ReadonlyArray<Partial<SongProperties>> = [
//   // 自傷無色 is debuted at Festival (intl), SPLASH (Jp)
//   { name: "自傷無色", dx: 1, debut: 19 },
//   // 劣等上等 is debuted at Festival (intl), SPLASH (Jp)
//   { name: "劣等上等", dx: 1, debut: 19 },
// ];
