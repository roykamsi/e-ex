module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          "vue-style-loader",
          "css-loader",
          'sass-loader',
          {
            loader: "css-loader",
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
