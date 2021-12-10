import {babel} from "@rollup/plugin-babel";
import {terser} from "rollup-plugin-terser";

function config({output, plugins = []}) {
  return {
    input: "index.mjs",
    output: {
      sourcemap: true,
      ...output
    },
    plugins: [
      babel({
        babelHelpers: "bundled"
      }),
      terser(),
      ...plugins
    ]
  };
}

export default [
  config({
    output: {
      format: "iife",
      name: "DraggableList",
      file: "dist/draggable-list.iife.js"
    }
  }),
  config({
    output: {
      format: "esm",
      file: "dist/draggable-list.esm.js"
    }
  })
];
