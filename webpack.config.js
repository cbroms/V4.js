const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "V4.js",
        library: "V4",
        libraryTarget: "var",
        globalObject: "this",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },

    devtool: "inline-source-map",
    devServer: {
        contentBase: "./dist"
    }
};
