const presets = [
  [
    "@babel/env",
    {
      targets: {
        chrome: "55"
      },
      // https://github.com/facebook/regenerator/issues/276
      include: ["transform-template-literals"],
      exclude: ["transform-regenerator"]
    },
  ],
];

module.exports = { presets };
