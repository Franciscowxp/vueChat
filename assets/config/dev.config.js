const config = require('./base.config');
const clone = require('clone');

newConfig = Object.assign(config, {

    devtool: 'cheap-eval-source-map',
    // 服务器配置相关，自动刷新!
    devServer: {
        contentBase: './assets/',
        historyApiFallback: {
            index: './index.html'
        },
        hot: true,
        inline: true,
        // grogress: true,
        // proxy:proxy,
        port:8888
        // host:'10.33.1.140'
    }
});
newConfig.module.loaders.push(
    // 编译sass 编译css并自动添加css前缀
    {
        test: /\.scss$/,
        loader: 'style-loader!css-loader?sourceMap!postcss-loader!sass-loader?sourceMap'
    }
)

module.exports = newConfig;