var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var fs = require('fs');
var git = require('gulp-git');
var shell = require('gulp-shell');


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

// release to bower
gulp.task('release', function () {
	// read version from package.json
	// update bower to match package.json
    // git tag and push
    // npm publish .
	var packageJSON = require('./package.json');
	var bowerJSON = require('./bower.json');
	bowerJSON.version = packageJSON.version;
	// write the new bower.json file
	fs.writeFileSync('bower.json', JSON.stringify(bowerJSON, null, '  '));
	// push to github (which also impacts bower)
	var version = 'v' + packageJSON.version;
	git.tag(version, 'release of version ' + packageJSON.version);
	git.push('origin', 'master', {args: '--tags'});
	// TODO: why does bower read from master?
	console.log('npm')
	shell.task(['npm publish .']);
});

// full publish flow
gulp.task('publish', ['build', 'test', 'release'], function () {
    return;
});