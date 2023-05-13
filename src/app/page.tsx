import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import * as csv from "csv/sync";
import { ResponseCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { randomUUID } from "crypto";
import { addMinutes } from "date-fns";

const alias: Record<string, string> = {
  "D✪N’T ST✪P R✪CKIN’": "D✪N’T  ST✪P  R✪CKIN’",
};

async function fetchMaimaiArcadeSongs() {
  const data = await fetch(
    "https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json",
    {
      cache: "no-cache",
    }
  ).then((res) => res.json());

  const allSongs: Song[] = data.songs;
  const internationalSongs = allSongs.filter((song) => {
    return song.sheets.some((sheet) => sheet.regions.intl);
  });

  const versions: Version[] = data.versions;

  return { internationalSongs, versions };
}

async function maimaiScore(data: FormData) {
  "use server";

  // const mutableCookie = cookies() as unknown as ResponseCookies;
  // const sid = randomUUID();

  // const exp = addMinutes(new Date(), 10);

  // mutableCookie.set({
  //   name: "sid",
  //   value: sid,
  //   expires: exp,
  // });

  const mai = data.get("data")?.toString() ?? "";

  const maimaiScoreList = csv.parse(mai, {
    delimiter: "\t",
    quote: false,
    escape: false,
  }) as string[];

  const aliasReplaced = maimaiScoreList.map((arr) => {
    const name = alias[arr[0]] ?? arr[0];
    return [name, ...arr.slice(1)] as string[];
  });

  const mapped = aliasReplaced.map((arr) => ({
    name: arr[0],
    diff: arr[2],
    mapType: arr[4],
    achi: arr[5],
  }));

  console.log(mapped);

  // await kv.set(sid, JSON.stringify(mapped), {
  //   pxat: +exp,
  // });

  return mapped;
}

export default async function HomePage() {
  const { internationalSongs, versions } = await fetchMaimaiArcadeSongs();

  const sid = cookies().get("sid")?.value;

  if (sid) {
    console.log(await kv.get(sid));
  }

  return (
    <>
      {!sid && (
        <form action={maimaiScore}>
          <textarea name="data" />
          <input type="submit"></input>
        </form>
      )}
      <div>
        {versions.map((version) => {
          return (
            <div key={version.version}>
              <p>{version.abbr}</p>
              {internationalSongs
                .filter((song) => song.version === version.version)
                .map((song) => {
                  return <div key={song.songId}> {song.title} </div>;
                })}
              <hr></hr>
            </div>
          );
        })}
      </div>
    </>
  );
}

type Version = { version: string; abbr: string };

type Song = {
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

type Sheet = {
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
