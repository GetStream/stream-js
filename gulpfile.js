var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var fs = require('fs');
var git = require('gulp-git');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var bump = require('gulp-bump');

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
    return gulp.src('./test/integration/cov.js', {read: false})
        .pipe(mocha({reporter: 'html-cov'}))
        .pipe(gulp.dest('./dist/'));
        
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
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('bump', function () {
  return gulp.src(['./package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('npm', function (done) {
  require('child_process').spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
});

// release to bower
gulp.task('write_bower', function () {
	var packageJSON = require('./package.json');
	var bowerJSON = require('./bower.json');
	var version = packageJSON.version;
	var message = 'Released version ' + versionName;
	var versionName = 'v' + version;
	console.log('Updating bower.json');
	bowerJSON.version = version;
	fs.writeFileSync('bower.json', JSON.stringify(bowerJSON, null, '  '));
	return;
});

gulp.task('tag', function () {
  var pkg = require('./package.json');
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(v, message, {}, gutil.log))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});

// full release flow
gulp.task('release', ['write_bower', 'npm'], function () {
    return;
});

// full publish flow
gulp.task('publish', ['build', 'test', 'release'], function () {
    return;
});