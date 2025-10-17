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
        fallback: {
            // Provide polyfills for Node.js modules used in the code
            "path": require.resolve("path-browserify"),
            "fs": false,
            "os": false,
            "crypto": false,
            "stream": false,
            "buffer": require.resolve("buffer"),
            "process": require.resolve("process/browser")
        }
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
        new (require('webpack')).ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ],
    devtool: 'source-map'
};

module.exports = webConfig;