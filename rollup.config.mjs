import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "index.mjs",
  output: [...matrix(
    [
      [{ format: "iife", name: "DraggableList" }, { format: "esm" }],
      [() => ({ plugins: [terser()] }), {}],
    ],
    (r) => ({
      file: `dist/draggable-list.${r.format}${r.plugins ? ".min" : ""}.js`,
    })
  )],
  plugins: [
    babel({
      babelHelpers: "bundled",
    }),
  ],
};

function* matrix(rows, other) {
  yield* search(0, {});

  function* search(i, result) {
    if (i >= rows.length) {
      yield { ...result, ...other(result) };
      return;
    }
    for (const data of rows[i]) {
      const newData = {
        ...result,
        ...(typeof data === "function" ? data() : data),
      };
      yield* search(i + 1, newData);
    }
  }
}
