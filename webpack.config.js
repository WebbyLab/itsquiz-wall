var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./client/app.js",
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true)
            }
        }),
        new ExtractTextPlugin("[name].css")
    ],
    output: {
        path: __dirname + '/public/static/build/',
        filename: "main.js",
        publicPath: "static/build/"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!autoprefixer-loader!less-loader")
            },

            { test: /\.gif$/, loader: "url-loader?limit=10000&mimetype=image/gif" },
            { test: /\.jpg$/, loader: "url-loader?limit=10000&mimetype=image/jpg" },
            { test: /\.png$/, loader: "url-loader?limit=10000&mimetype=image/png" },
            { test: /\.svg/, loader: "url-loader?limit=26000&mimetype=image/svg+xml" },
            { test: /\.(woff|woff2|ttf|eot)/, loader: "url-loader?limit=1" },

            { test: /\.jsx$/, loader: "react-hot!babel!eslint-loader", exclude: [/node_modules/, /public/] },
            { test: /\.js$/, loader: "babel!eslint-loader", exclude: [/node_modules/, /public/] },

            { test: /\.json$/, loader: "json-loader"}
        ]
    },
    eslint: {
        configFile: '.eslintrc'
    }
};
