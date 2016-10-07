var gulp = require('gulp')
  , jshint = require('gulp-jshint')
  , jscs = require('gulp-jscs')
  , stylish = require('gulp-jscs-stylish')
  , fs = require('fs')
  , uglify = require('gulp-uglify');

// check for jshint and jscs errors
gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint({ lookup: true }))
    .pipe(jscs())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

/*
 * Distribution related tasks
 */

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
