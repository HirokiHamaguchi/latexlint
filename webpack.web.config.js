//@ts-check

'use strict';

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const webConfig = {
    target: 'web', // Target web environment for browser
    mode: 'production',

    entry: {
        main: './src/web.ts', // Main TypeScript entry point
        styles: './src/web/styles.css' // CSS entry point
    },
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].js',
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
        alias: {
            "vscode": path.resolve(__dirname, 'src/vscode-shim.ts')
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.web.json'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new (require('html-webpack-plugin'))({
            template: './src/web/template.html',
            filename: 'index.html'
        })
    ],
    devtool: 'nosources-source-map',
    infrastructureLogging: {
        level: "log", // enables logging required for problem matchers
    },
};
module.exports = [webConfig];
