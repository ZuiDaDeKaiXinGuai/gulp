var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concats = require('gulp-concat');
var minhtml = require('gulp-htmlmin');
var minweb = require('gulp-webserver');
var path = require('path');
var fs = require('fs');
var url = require('url');
var data = require('./data.json');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var clearCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var collector = require('gulp-rev-collector')

gulp.task('default', function() {
    return gulp.src('./commit/**/*.js')
        .pipe(gulp.dest('./build/js'))
})

gulp.task('mincopy', function() {
    return gulp.src(['./commit/**/*', '!./commit/**/*.scss'])
        .pipe(gulp.dest('./bulid'))
})

gulp.task('minscss', function() {
    return gulp.src('./commit/scss/*.scss')
        .pipe(sass())
        //.pipe(autoprefixer())
        .pipe(gulp.dest('./commit/css'))
})

// gulp.task('contats', function() {
//     return gulp.src('./commit/scss/*.scss')
//         .pipe(sass())
//         .pipe(concats({

//         }))
//         .pipe(gulp.dest('./commit/css'))
// })

//压缩html
gulp.task('minhtml', function() {
    return gulp.src('./commit/*.html')
        .pipe(minhtml({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('./build/'))
});
//压缩js
gulp.task('uglifymin', function() {
    return gulp.src('./commit/js/index.js')
        .pipe(babel())
        .pipe(concats('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
});

//rev
gulp.task('rev', function() {
    return gulp.src('./commit/js/index.js')
        .pipe(rev())
        .pipe(gulp.dest('./build/js'))
        .pipe(rev.manifest()) //json
        .pipe(gulp.dest('./commit/'))
});

//替换
gulp.task('collector', function() {
    return gulp.src(['./commit/*.json', './commit/html.html'])
        .pipe(collector({
            replaceReved: true
        }))
        .pipe(gulp.dest('./build/'))
})


//起服务
gulp.task('minweb', function() {
    return gulp.src('./commit')
        .pipe(minweb({
            port: 3000,
            open: true,
            livereload: true,
            host: '192.168.0.39',
            fallback: 'html.html',
            middleware: function(req, res) {
                var pathname = url.parse(req.url).pathname;
                if (pathname == '/favicon.ico') {
                    return res.end('');
                }
                if (pathname == '/api/list') {
                    return res.end(JSON.stringify(data));
                } else {
                    res.end(fs.readFileSync(path.join(__dirname, 'commit', pathname === '/' ? 'html.html' : pathname)));
                }
            }
        }))
})
gulp.task('text', function() {
    return gulp.watch('./commit/scss/*.scss', gulp.series('minscss'));
});
//
gulp.task('dev', gulp.series('minscss', 'minweb', 'text'));
//上线执行
gulp.task('build', gulp.series('minhtml', 'uglifymin', 'minhtml', 'rev', 'collector'));