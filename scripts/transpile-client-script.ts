import { OutputOptions, rollup, RollupOptions } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

const outputOptionsList: OutputOptions[] = [
  {
    dir: "./public/scripts",
    entryFileNames: "mai-fetch.js",
    format: "iife",
  },
];

const config: RollupOptions = {
  input: {
    main: "./client-scripts/main.ts",
  },
  output: outputOptionsList,
  plugins: [
    typescript({
      compilerOptions: {
        jsx: "react-jsx",
      },
      include: ["./client-scripts/**/*.ts", "./client-scripts/**/*.tsx"],
      outputToFilesystem: false,
    }),
    commonjs(),
    nodeResolve(),
    terser({
      compress: {
        inline: false,
        global_defs: {
          "@process.env.NODE_ENV": "'production'",
          "@process.env.QUERY_HOST": `'${process.env.QUERY_HOST}'`,
        },
      },
    }),
  ],
};

rollup(config)
  .then((bundle) => {
    return bundle.write(outputOptionsList[0]);
  })
  .then(() => {
    console.log("Compiled");
  });
