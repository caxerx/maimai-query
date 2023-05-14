import { useState } from "react";
import { Difficulty, fetchScore, parseSongList } from "./utils/fetch-score";
import { postScore } from "./utils/fetch";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setMessage] = useState("");

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid black",
          width: "250px",
          height: "50px",
          background: "aquamarine",
        }}
        name="fetch-btn"
        onClick={async () => {
          if (loading) return;
          setLoading(true);
          try {
            const basic = await fetchScore(Difficulty.BASIC);
            const advanced = await fetchScore(Difficulty.ADVANCED);
            const expert = await fetchScore(Difficulty.EXPERT);
            const master = await fetchScore(Difficulty.MASTER);
            const remaster = await fetchScore(Difficulty.ReMASTER);

            const basicParsed = await parseSongList(basic, Difficulty.BASIC);
            const advancedParsed = await parseSongList(
              advanced,
              Difficulty.ADVANCED
            );
            const expertParsed = await parseSongList(expert, Difficulty.EXPERT);
            const masterParsed = await parseSongList(master, Difficulty.MASTER);
            const remasterParsed = await parseSongList(
              remaster,
              Difficulty.ReMASTER
            );

            const allParsed = basicParsed.concat(
              advancedParsed,
              expertParsed,
              masterParsed,
              remasterParsed
            );

            const submitResp = (await postScore(allParsed)) as {
              dataId: string;
            };

            window.open(`${process.env.QUERY_HOST}/${submitResp.dataId}`);
          } catch (e) {
            console.error(e);
            setMessage("Failed to fetch score.");
          }

          setLoading(false);
        }}
      >
        {loading && (
          <div
            style={{
              color: "black",
              height: "32px",
              width: "32px",
            }}
          >
            <Loading></Loading>
          </div>
        )}
        Analyze Completion
      </button>
      {errorMessage && (
        <p
          style={{
            color: "red",
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

function Loading() {
  return (
    <svg
      version="1.1"
      id="L9"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enable-background="new 0 0 0 0"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <path
        fill="currentColor"
        d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          dur="1s"
          from="0 50 50"
          to="360 50 50"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
