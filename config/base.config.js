const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const baseUrl = path.join(__dirname, '..');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: {
        'app': ['babel-polyfill', './app.js']
    },
    target: 'node',
    externals: nodeModules,
    output: {
        path: baseUrl,
        // 文件地址，使用绝对路径形式
        filename: '[name].dist.js',
    },
    context: baseUrl,
    node: {
        __filename: false,
        __dirname: false
    },
    module: {
        // 加载器
        loaders: [
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: [path.join(__dirname, './assets/modules'), 'node_modules'],
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue', '.scss', '.sass', '.json'],

    }
};