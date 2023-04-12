const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const outputDirectory = "dist";
module.exports = {
  resolve: {
    fallback: {
      "fs": false,
      "stream": require.resolve("stream-browserify"),
      "timers": require.resolve("timers-browserify"),
      "buffer": require.resolve("buffer/"),
      "path": require.resolve("path-browserify"),
      "url": require.resolve("url/"),
      "https": require.resolve("https-browserify"),
      "http": require.resolve("stream-http")
    },
    alias: {
      Components: path.resolve(__dirname, './src/client/components/'),
      Client: path.resolve(__dirname, './src/client/'),
      Constants: path.resolve(__dirname, './src/client/constants/'),
      Utils: path.resolve(__dirname, './src/client/utils/'),
      Firebase: path.resolve(__dirname, './src/client/firebase.js'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.css', '.png', '.jpg', '.gif', '.jpeg'],
  },
  mode: 'production',
  entry: "./src/client/index.js",
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: '[name].bundle.js',
    publicPath: '/build'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-bootstrap|redux|react-router|react-icons|react-redux|react-overlays|react-slick)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
        firebase: {
          test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
          name: 'firebase',
          chunks: 'all',
        }
      }
    },
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
        use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 100000
                    }
                }
            ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico"
    }),
    new CompressionPlugin({
      filename: "[path][base].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    // new BundleAnalyzerPlugin(),

  ]
};
