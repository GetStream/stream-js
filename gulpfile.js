var gulp = require('gulp');
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

// release to bower
gulp.task('release', function () {
	// read version from package.json
	// update bower to match package.json
    // git tag and push
    // npm publish .
    //TODO: use something gulp instead of make, gulp-git seems broken
    // TODO: why does bower read from master?
	var packageJSON = require('./package.json');
	var bowerJSON = require('./bower.json');
	var version = packageJSON.version;
	var message = 'Released version ' + versionName;
	var versionName = 'v' + version;
	
	console.log('Releasing version ' + versionName);
	console.log(process.cwd());
	// write the new bower.json file
	console.log('Updating bower.json');
	bowerJSON.version = version;
	fs.writeFileSync('bower.json', JSON.stringify(bowerJSON, null, '  '));
	// push to github (which also impacts bower)
	console.log('Git tagging and releasing');
	return gulp.src('./')
	    .pipe(git.commit(message))
	    .pipe(git.tag(versionName, message))
	    .pipe(git.push('origin', 'master', '--tags'))
	    .pipe(gulp.dest('./'));
	//.pipe(shell.task(['npm publish .']));
	
});

// full publish flow
gulp.task('publish', ['build', 'test', 'release'], function () {
    return;
});