const webpack = require('webpack');
const config = require('./base.config');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const clone = require('clone');
const newConfig = clone(config);

newConfig.devtool = false;
newConfig.module.loaders.push(
    // 编译sass 编译css并自动添加css前缀
    {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: 'css-loader!postcss-loader!sass-loader'
        })
    }
);
// 修改最终发布地址
newConfig.output.publicPath = "/assets/dist/";

newConfig.plugins = (config.plugins || []).concat([
    // this allows uglify to strip all warnings
    // from Vue.js source code.
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    // 压缩js css html
    // This minifies not only JavaScript, but also
    // the templates (with html-minifier) and CSS (with cssnano)!
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'common',
    //     filename: 'common.js',
    //     async: true,
    //     minChunks: 2
    // }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackPlugin({
        title: 'vue chat',
        cache: true,
        template: './index.ejs'
    })
    // new webpack.optimize.DedupePlugin()

]);

module.exports = newConfig;