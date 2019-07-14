import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
//import { uglify } from "rollup-plugin-uglify";

const pkg = require("./package.json");

const banner = `/*
 * V4.js ${pkg.version} <https://V4.rainflame.com>
 * Copyright (c) ${new Date().getFullYear()} Christian Broms <cb@rainfla.me>
 * Released under Lesser GPL v3.0
 */

 var opentype_js = opentype;`;

export default [
  {
    external: ["opentype.js"],
    output: {
      globals: {
        "opentype.js": "opentype" // this doesn't seem to work right now, rollup defaults to opentype_js
      },
      exports: "named",
      file: "dist/V4.js",
      format: "umd",
      name: "V4",
      banner
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      resolve(),
      commonjs(),
      // babel(),
      // uglify(),
      serve({ contentBase: "dist", port: 8080 })
    ],
    watch: {
      include: "src/**"
    },
    input: "src/index.ts"
  }
  // {
  //   input: "src/index.js",
  //   output: {
  //     exports: "named",
  //     file: "dist/V4.min.js",
  //     format: "umd",
  //     name: "V4"
  //   },
  //   plugins: [
  //     butternut(),
  //     resolve(),
  //     commonjs(),
  //     babel({
  //       exclude: "node_modules/**"
  //     })
  //   ],
  //   watch: {
  //     include: "src/**"
  //   }
  // }
];
