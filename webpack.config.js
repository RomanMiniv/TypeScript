const path = require('path');

module.exports = {
  entry: './index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        // test: /\.m?js$/,
        // test: /\.(ts|js)x?$/,
        test: /\.ts$/,
        // exclude: /(node_modules|bower_components)/,
        use: 'ts-loader',
        exclude: /node_modules/,
        // use: [
        //   {
        //     loader: "babel-loader",
        //     options: {
        //       configFile: "./babel.config.js",
        //       cacheDirectory: true
        //     }

        //   }
        // ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  mode: 'development',
  devServer: {
    inline: true
  },
  devtool: "source-map"
}