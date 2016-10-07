var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs')
clone = require('clone'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*']
    });

// 配置
var cfg = {
    svgPath: '../static/images/svg/',
    svgSprite: '../static/images/sprite/'
};

gulp.task('svg', function() {
    let result = fs.readdirSync(path.join(__dirname, cfg.svgPath));
    result.forEach(function(el) {
        let newPath = path.join(__dirname, cfg.svgPath, el);
        if (fs.statSync(newPath).isDirectory()) {
            gulp.src(path.join(newPath, '*.svg'))
                .pipe(plugins.svgSymbols({
                    templates: [
                        'default-svg'
                    ]
                }))
                .pipe(plugins.rename({
                    basename: el,
                    extname: ".svg"
                }))
                .pipe(gulp.dest(cfg.svgSprite))
        }
    });
});