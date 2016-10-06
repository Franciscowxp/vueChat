var gulp = require('gulp'),
    path = require('path'),
    clone = require('clone'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*']
    });

// 配置
var cfg = {
    svgPath: '../static/images/svg/',
    svgSprite:'../static/images/sprite/'
};


gulp.task('svg',function(){
    gulp.src(cfg.svgPath+'*.svg')
    .pipe(plugins.svgSymbols())
    .pipe(gulp.dest(cfg.svgSprite))
});


