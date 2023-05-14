import ky from "ky";
import { Score } from "./fetch-score";

export async function postScore(score: Score[]) {
  const json = await ky
    .post(`${process.env.QUERY_HOST}/api/submit`, {
      json: score,
    })
    .json();

  return json;
}

export async function fetchPage(url: string) {
  const html = await ky.get(url).text();

  const parser = new DOMParser();

  return parser.parseFromString(html, "text/html");
}
