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

const disableSssStatus = ["maimai", "maimai PLUS"];

export default async function HomePage({ params }: any) {
  const sid = params.id[0];
  const data: Score[] = (await kv.get(sid)) ?? [];

  if (!data || data.length === 0) {
    redirect("/");
  }

  const renderDifficulty = (
    difficulty: Difficulty,
    progress: ChartProgress,
    showSssProgress: boolean
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
        {showSssProgress && (
          <td
            style={{
              backgroundColor: backgroundColor,
              border: "1px solid white",
            }}
          >
            {progress.sss[difficulty] ? "將" : "　"}
          </td>
        )}
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
          ([versionKey, versionName]) => {
            if (
              !SONG_BY_VERSION[versionName.version] ||
              SONG_BY_VERSION[versionName.version].length === 0
            ) {
              return <></>;
            }

            const showSssStatus = !disableSssStatus.includes(
              versionName.version
            );

            return (
              <div key={versionKey}>
                <p className="text-center my-4">{versionName.abbr}</p>
                <table>
                  <tbody>
                    {SONG_BY_VERSION[versionName.version]?.map((song) => {
                      const progress = getProgress(
                        song.title,
                        song.category,
                        getChartType(song.type),
                        data
                      );

                      if (!progress) {
                        return (
                          <tr key={song.songId}>
                            <td className="border border-r-0 border-white">
                              {song.type === "dx" ? "[DX]" : ""}
                              {song.title}
                            </td>
                            <td
                              colSpan={showSssStatus ? 16 : 12}
                              className="bg-red-900 border border-white"
                            ></td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={song.songId}>
                          <td className="border border-r-0 border-white">
                            {song.type === "dx" ? "[DX]" : ""}
                            {song.title}
                          </td>
                          {renderDifficulty(
                            Difficulty.BASIC,
                            progress,
                            showSssStatus
                          )}
                          {renderDifficulty(
                            Difficulty.ADVANCED,
                            progress,
                            showSssStatus
                          )}
                          {renderDifficulty(
                            Difficulty.EXPERT,
                            progress,
                            showSssStatus
                          )}
                          {renderDifficulty(
                            Difficulty.MASTER,
                            progress,
                            showSssStatus
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <hr className="my-4"></hr>
              </div>
            );
          }
        )}
      </div>
    </>
  );
}
