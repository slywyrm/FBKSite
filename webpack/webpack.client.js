const { AotPlugin } = require('@ngtools/webpack');
const webpack = require('webpack');
const { root } = require('./helpers');
const clientBundleOutputDir = root('./wwwroot/dist');
const prod = process.env.ASPNETCORE_ENVIRONMENT == "Production";

/**
 * This is a client config which should be merged on top of common config
 */
module.exports = {
    entry: {
        'main-browser': root('./client/main.browser.ts')
    },
    output: {
        path: root('./wwwroot/dist'),
    },
    target: 'web',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ]
};