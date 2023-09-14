const config = {
  mode: 'production',
  entry: {
    main: './app/js/main.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'sass-loader',
            options: {
              includePaths: require('node-normalize-scss').includePaths,
            },
          },
        ],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

module.exports = config;
