var gulp = require('gulp'),
    path = require('path'),
    fs = require('fs'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*', 'stream-combiner']
    });

// 配置
var cfg = {
    svgPath: '../static/images/svg/',
    svgSprite: '../static/images/sprite/'
};

function combineSvg(pathName, newPath) {
    let streamList = [];
    if (fs.statSync(newPath).isDirectory()) {
        gulp.src(path.join(newPath, '*.svg'))
            .pipe(plugins.svgSymbols({
                templates: ['default-svg']
            }))
            .pipe(plugins.rename({
                basename: pathName,
                extname: ".svg"
            }))
            .pipe(gulp.dest(cfg.svgSprite))
    }
}

gulp.task('svg', function() {
    let result = fs.readdirSync(path.join(__dirname, cfg.svgPath));
    result.forEach(function(el) {
        var newPath = path.join(__dirname, cfg.svgPath, el);
        if (el === 'emoticon') {
            fs.readdirSync(newPath).forEach(function(val) {
                combineSvg(val, path.join(newPath, val));
                let files = fs.readdirSync(path.join(newPath, val)).map(function(value,key){
                    return /(.+)\.svg/.exec(value)[1];
                });
                let fhander = fs.openSync(path.join(__dirname, cfg.svgSprite, val + '.json'), 'w');
                fs.writeSync(fhander, JSON.stringify(files));
                fs.closeSync(fhander);
            })
        } else {
            combineSvg(el, newPath);
        }
    });
});