import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import license from "rollup-plugin-license";
import butternut from "rollup-plugin-butternut";
import serve from "rollup-plugin-serve";

export default [
  {
    input: "src/index.js",
    output: {
      exports: "named",
      file: "dist/V4.js",
      format: "umd",
      name: "V4"
    },
    plugins: [
      serve({ contentBase: "dist", port: 8080 }),
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      }),
      license({
        banner:
          "V4.js v<%= pkg.version %>\n" +
          "(c) 2019 Christian Broms\n" +
          "https://V4.rainflame.com"
      })
    ],
    watch: {
      include: "src/**"
    }
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
