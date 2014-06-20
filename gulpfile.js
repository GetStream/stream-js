var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');


gulp.task('default', function() {
  // watch for JS changes and run tests
  gulp.watch('./src/lib/*.js', function() {
  	gulp.run('build');
    gulp.run('test');
  });
});

/*
 * Testing related tasks
 */

// check for jshint errors
gulp.task('lint', function() {
  return gulp.src('./src/lib/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// run the mocha tests
gulp.task('mocha', function () {
    return gulp.src('./test/integration/index.js', {read: false})
        .pipe(mocha());
});

// run the mocha tests
gulp.task('cov', function () {
    return gulp.src('./test/integration/index.js', {read: false})
        .pipe(mocha({reporter: 'html-cov'}))
        .pipe(gulp.dest('./build/'));
        
});

// run the tests
gulp.task('test', ['lint', 'mocha'], function () {
    return;
});

/*
 * Distribution related tasks
 */

var browserify = require('gulp-browserify');

// Basic usage
gulp.task('build', function() {
    // Single entry point to browserify
    gulp.src('src/getstream.js')
        .pipe(browserify({
          insertGlobals : false,
          debug : false,
          standalone : 'stream'
        }))
        .pipe(gulp.dest('./dist/js'));
});