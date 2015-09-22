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
    module: {
      loaders: [
        { test: /jsonwebtoken\/(.*)js/, loader: "babel-loader"},
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    }
};