const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const port = process.env.PORT || 3000;
const PATH_SOURCE = path.join(__dirname, "src/")
const PATH_BUILD = path.resolve(__dirname, "dist")
const { WebpackManifestPlugin } = require("webpack-manifest-plugin")

module.exports = {
    mode: "development",
    entry: {
        app: ['babel-polyfill',"./src/index.js"],
    },
    output: {
        filename: "bundle.js",
        path: PATH_BUILD,
        publicPath: '.',
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["css-loader"]
            },
            {
                test: /\.(png|jp(e*)g|ico)$/,
                loader: 'url-loader',
                options: {
                    // limit: 8000,
                    name: 'images/[hash]-[name].[ext]'
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                },
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack', 'url-loader']
                // loader: 'svg-url-loader'
                // loader: 'file-loader',
                // options: {
                //     publicPath: './dist/',
                //     name: '[name].[ext]?[hash]'
                // }
            },
            {
                test: /\.html$/,
                use : [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true,
                        }
                    }
                ]
            },
            {
                test: /\.json$/,
                exclude: /(node_modules)/,
                use: ['json-loader']
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        // host: 'localhost',
        port: port,
        // open: true,
        publicPath: "/"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            // filename: 'index.html'
            hash: true,
        }),
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin({
            fileName: "manifest.json",
            basePath: "/dist"
        })
    ]
}