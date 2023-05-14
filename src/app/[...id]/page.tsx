import { redirect } from "next/navigation";
import { kv } from "@vercel/kv";
import {
  DIFFICULTY_COLOR,
  Difficulty,
  Score,
} from "../../../client-scripts/utils/fetch-score";
import {
  ARCADE_SONGS_VERSION_DATA,
  SONG_BY_VERSION,
} from "@/utils/fetch-songs";
import { ChartProgress, getProgress } from "@/utils/progress";
import { getChartType } from "@/utils/score";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: any) {
  const sid = params.id[0];
  const data: Score[] = (await kv.get(sid)) ?? [];

  if (!data || data.length === 0) {
    redirect("/");
  }

  const renderDifficulty = (
    difficulty: Difficulty,
    progress: ChartProgress
  ) => {
    const backgroundColor = DIFFICULTY_COLOR.get(difficulty);

    return (
      <>
        <td
          style={{
            backgroundColor: backgroundColor,
            border: "1px solid white",
          }}
        >
          {progress.fc[difficulty] ? "極" : "　"}
        </td>
        <td
          style={{
            backgroundColor: backgroundColor,
            border: "1px solid white",
          }}
        >
          {progress.fdx[difficulty] ? "舞" : "　"}
        </td>
        <td
          style={{
            backgroundColor: backgroundColor,
            border: "1px solid white",
          }}
        >
          {progress.ap[difficulty] ? "神" : "　"}
        </td>
      </>
    );
  };

  return (
    <>
      <div className="text-sm leading-none">
        {Object.entries(ARCADE_SONGS_VERSION_DATA).map(
          ([versionKey, versionName]) => (
            <div key={versionKey}>
              <p>{versionName.abbr}</p>
              <table>
                <tbody>
                  {SONG_BY_VERSION[versionName.version]?.map((song) => {
                    const progress = getProgress(
                      song.title,
                      getChartType(song.type),
                      data
                    );

                    return (
                      <tr key={song.songId}>
                        <td className="border border-r-0 border-white">
                          {song.type === "dx" ? "[DX]" : ""}
                          {song.title}
                        </td>
                        {renderDifficulty(Difficulty.BASIC, progress)}
                        {renderDifficulty(Difficulty.ADVANCED, progress)}
                        {renderDifficulty(Difficulty.EXPERT, progress)}
                        {renderDifficulty(Difficulty.MASTER, progress)}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <hr></hr>
            </div>
          )
        )}
      </div>
    </>
  );
}
