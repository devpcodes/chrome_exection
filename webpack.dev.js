const path = require("path")
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        index: [
            // "webpack-hot-middleware/client?reload=true",
            "./src/index.js"
        ]
    },
    mode: "development",
    output: {
        chunkFilename: "[name]-bundle.js",
        filename: "[name].js",
        path: path.resolve(__dirname, "./public")
    },
    devServer: {
        contentBase: "./public",
        // overlay: true,
        // hot: true,
        // stats: {
        //     colors: true
        // },
        // inline: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                'react',
                                'stage-0',
                                'es2015',
                                ['env', { targets: {browsers: ['last 2 versions'] }}]
                            ],
                            "plugins": [
                                "transform-runtime",
                                "transform-class-properties",
                                ["import",{
                                    "libraryName": "antd",
                                    "style": "css"
                                }],
                                "syntax-dynamic-import",
                                "universal-import"
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    { loader: MiniCssExtractPlugin.loader },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: MiniCssExtractPlugin.loader },
                    { 
                        // query: {
                        //     modules: true,
                        //     localIdentName: "[name]--[local]--[hash:base64:8]"
                        // },
                        loader: "css-loader"
                    },
                    { 
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [require('autoprefixer')({
                                'browsers': ['> 1%', 'last 2 versions']
                            })],
                        }
                    },
                    { loader: "sass-loader" }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: {
                            attrs: ["img:src"]
                        }
                    }
                ]
            },
            {
                test: /\.(jpg|gif|png|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "images/[name]-[hash:8].[ext]"
                        }
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
        // new webpack.HotModuleReplacementPlugin()
    ]
}