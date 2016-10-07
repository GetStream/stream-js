var path = require("path");
var webpack = require("webpack");
var RewirePlugin = require("rewire-webpack");
var minify = process.argv.indexOf('--minify') !== -1;

var plugins = [
    new webpack.DefinePlugin({
      IS_BROWSER_ENV: true,
    }),
    new webpack.NormalModuleReplacementPlugin(/(jsonwebtoken|http-signature|batch_operations|qs)/, path.join(__dirname, "src", "/missing.js")),
    new RewirePlugin(),
];

if (minify) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = {
    context: __dirname + "/src",
    entry: {
        stream: "./getstream.js"
    },
    output: {
        path: minify ? 
            path.join(__dirname, 'dist', 'js_min') : 
            path.join(__dirname, "dist", "js"),
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
    plugins: plugins,
};
