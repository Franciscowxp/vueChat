const path = require('path');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const baseUrl = path.join(__dirname, '..');
const webpack = require('webpack');

module.exports = {
    context: baseUrl,
    entry: {
        'app': ['babel-polyfill', './app.js']
    },
    // 输出
    output: {
        path: path.join(__dirname, '../dist'),
        // 文件地址，使用绝对路径形式
        filename: 'js/[name].js',
        //[name]这里是webpack提供的根据路口文件自动生成的名字
        publicPath: '/dist/',
        // 公共文件生成的地址
        sourceMapFilename: '[file].map',
        chunkFilename: 'js/[name].js?ver=[chunkhash]'

    },
    // 加载器
    module: {
        // 加载器
        loaders: [
            // 解析.vue文件
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // 转化ES6的语法
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // 图片转化，小于8K自动转化为base64的编码
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=8192&name=imgs/[name].[ext]'
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?limit=8192&name=fonts/[name].[ext]'

            },
            {
                test: /\.json$/,
                loader:'json-loader',
                exclude: /node_modules/
            }
            //html模板编译？
            // { test: /\.(html|tpl)$/, loader: 'html-loader' },
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            // .vue的配置。需要单独出来配置，其实没什么必要--因为我删了也没保错，不过这里就留这把，因为官网文档里是可以有单独的配置的。
            vue: {
                loaders: {
                    css: 'style-loader!css-loader!postcss-loader',
                }
            },
            // 使用postcss 来加载autoprefixer
            postcss: function() {
                return [precss, autoprefixer({
                    browsers: ['last 4 versions']
                })];
            },
            // 转化成es5的语法
            // babel: {
            //     presets: ['es2015', 'stage-2'],
            //     plugins: ['transform-runtime']
            // }
        })
    ],
    resolve: {
        modules: [path.join(__dirname, '../js'), 'node_modules'],
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue', '.scss', '.sass', '.json'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            components: path.join(__dirname, '../components'),
            modules: path.join(__dirname, '../modules'),
            store: path.join(__dirname, '../store'),
            mock: path.join(__dirname, '../mock/'),
            data: path.join(__dirname, '../data/'),
            sass: path.join(__dirname, '../static/sass'),
            fonts: path.join(__dirname, '../static/fonts'),
            images: path.join(__dirname, '../static/images')
        }
    },
    // externals: {
    //     'vue': 'Vue',
    // }
};