const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const outputDirectory = "dist";
module.exports = {
  resolve: {
    alias: {
      Components: path.resolve(__dirname, './src/client/components/'),
      Client: path.resolve(__dirname, './src/client/'),
      Constants: path.resolve(__dirname, './src/client/constants/'),
      Utils: path.resolve(__dirname, './src/client/utils/'),
      Firebase: path.resolve(__dirname, './src/client/firebase.js'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.css', '.png', '.jpg', '.gif', '.jpeg'],
  },
  node: { fs: 'empty' },
  mode: 'development',
  entry: [
        './src/client/index.js',
        'webpack-dev-server/client?http://0.0.0.0:3091',
        'webpack/hot/only-dev-server'
    ],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: "bundle.js",
    publicPath: '/build'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: "url-loader?limit=100000"
      }
    ]
  },
  devServer: {
    hot: true,
    filename: 'bundle.js',
    publicPath: '/build',
    historyApiFallback: true,
    contentBase: './dist',
    port: 3091,
    proxy: [{
      context: ['/build', '/res','/read-url', '/check-transcript','/s'],
      target: 'http://localhost:3090',
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico"
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
