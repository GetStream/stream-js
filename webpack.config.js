var path = require("path");
var webpack = require("webpack");
var minify = process.argv.indexOf('--minify') !== -1;

var plugins = [
    new webpack.DefinePlugin({
      IS_BROWSER_ENV: true,
    }),
    new webpack.NormalModuleReplacementPlugin(/(jsonwebtoken|http-signature|batch_operations|qs)/, path.join(__dirname, "src", "/missing.js")),
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
          // We do not use ES6 in our library but one of our dependencies does
          // so please do not remove this line or we will distribute ES6 code
          // to all browsers:
        { test: /\.js$/, exclude: /node_modules|kjur/, loader: "babel-loader"}
      ]
    },
    plugins: plugins,
};
