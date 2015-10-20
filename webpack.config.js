var path = require("path");
var webpack = require("webpack");

module.exports = {
    context: __dirname + "/src",
    entry: {
        stream: "./getstream.js"
    },
    output: {
        path: path.join(__dirname, "dist", "js"),
        publicPath: "dist/",
        filename: "getstream.js",
        chunkFilename: "[chunkhash].js",
        library: "stream",
        libraryTarget: "umd"
    },
    node: {
        console: false,
        Buffer: true,
        crypto: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
      alias: {
        'request': 'browser-request',
        'jsonwebtoken': path.join(__dirname, "src", "missing.js"),
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
};
