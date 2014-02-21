var gulp = require('gulp');
var browserify = require('gulp-browserify');
var gutil = require('gulp-util');
var lr = require('tiny-lr');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var concat = require('gulp-concat');

// Builds the scripts based on a single entry point using browserify
gulp.task('scripts', function() {
    gulp.src(['index.js'])
        .pipe(browserify({
            // transform: ['hbsfy'],
            debug:true,
            output:'bundle.js',
            insertGlobals: true
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['scripts'], function() {
    http.createServer(ecstatic({root: __dirname})).listen(8080);
    gutil.log(gutil.colors.blue('HTTP server listening on port 8080'));
    gulp.watch(['*.js'], { ignore: ['bundle.js'] }, ['scripts']);
});