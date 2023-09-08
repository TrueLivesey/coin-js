const config = {
  mode: 'production',
  entry: {
    main: './app/js/main.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    devServer: {
      host: 'localhost',
      port: 3001,
    },
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
