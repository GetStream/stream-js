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
        Buffer: false,
        crypto: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        url: 'empty'
    },
    resolve: {
      alias: {
        'request': 'xmlhttp-request'
      }
    },
    module: {
      loaders: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
      ]
    },
    plugins: [new webpack.NormalModuleReplacementPlugin(/(jsonwebtoken|http-signature|batch_operations|qs)/, path.join(__dirname, "src", "/missing.js"))]
};
