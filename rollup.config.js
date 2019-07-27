import resolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";

const pkg = require("./package.json");

const banner = `/*
 * V4.js ${pkg.version} <https://V4.rainflame.com>
 *
 * Copyright ${new Date().getFullYear()}  Christian Broms <cb@rainfla.me>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 var opentype_js = opentype;`;

export default [
  {
    external: ["opentype.js"],
    input: "src/index.ts",
    output: {
      globals: {
        "opentype.js": "opentype", // this doesn't seem to work right now, rollup defaults to opentype_js
      },
      exports: "named",
      file: "dist/V4.js",
      format: "umd",
      name: "V4",
      banner,
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      resolve(),
      commonjs(),
      serve({ contentBase: "dist", port: 8080 }),
    ],
    watch: {
      include: "src/**",
    },
  },
  {
    external: ["opentype.js"],
    input: "src/index.ts",
    output: {
      globals: {
        "opentype.js": "opentype",
      },
      exports: "named",
      file: "dist/V4.min.js",
      format: "umd",
      name: "V4",
    },
    plugins: [
      typescript({ useTsconfigDeclarationDir: true }),
      resolve(),
      commonjs(),
      uglify({
        output: {
          preamble: banner,
        },
      }),
    ],
    watch: {
      include: "src/**",
    },
  },
];
