const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    //Source maps
    devtool: 'inline-source-map',
    //Webpack dev server
    devServer: {
        contentBase: './public',
        hot: true, //Hot module replacement
    },
});