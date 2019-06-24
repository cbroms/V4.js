const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        library: "textCanvas",
        libraryTarget: "var",
        globalObject: "this",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist"
    }
};
