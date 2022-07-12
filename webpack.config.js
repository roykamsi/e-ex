module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "vue-style-loader",
          "style-loader",
          "css-loader",
          {
            loader: ["css-loader", "postcss-loader"],
            options: {
              postcssOptions: {
                importLoaders: 1,
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
