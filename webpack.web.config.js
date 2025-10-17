//@ts-check

'use strict';

const path = require('path');

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const webConfig = {
    target: 'web', // Target web environment for browser
    mode: 'production',

    entry: './src/web.ts', // Web entry point
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'bundle.js',
        clean: true
    },
    resolve: {
        extensions: ['.ts', '.js'],
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
            }
        ]
    },
    plugins: [
        new (require('html-webpack-plugin'))({
            template: './index.html',
            filename: 'index.html'
        })
    ],
    devtool: 'nosources-source-map',
    infrastructureLogging: {
        level: "log", // enables logging required for problem matchers
    },
};
module.exports = [webConfig];
