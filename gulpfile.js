var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var mocha = require('gulp-mocha');
var fs = require('fs');
var git = require('gulp-git');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var bump = require('gulp-bump');
var async = require('async');
var source = require('vinyl-source-stream');
var webpack = require("webpack");
var webpackConfig = require('./webpack.config.js');
var child_process = require('child_process');


gulp.task('default', function() {
  // watch for JS changes and run tests
  gulp.watch('./src/lib/*.js', function() {
    gulp.run('build');
    gulp.run('test');
  });
});


function runSynchronized(tasks, callback){
    var sync = tasks.map(function(task){
        return function(callback){
            gulp.run(task, function(err){
                callback(err);
            });
        };
    });
    async.series(sync, callback);
}

/*
 * Testing related tasks
 */


// check for jshint and jscs errors
gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint({ lookup: true }))
    .pipe(jscs())
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// run the mocha tests
gulp.task('mocha', function () {
    return gulp.src(['./test/integration/index.js', './test/unit/index.js'], {read: false})
        .pipe(mocha())
        .once('end', function () {
            process.exit();
        });
});

// run the mocha tests
gulp.task('cov', function () {
    return gulp.src('./test/integration/cov.js', {read: false})
        .pipe(mocha({reporter: 'html-cov'}))
        .pipe(gulp.dest('./dist/'));

});

// run the tests
gulp.task('test', function () {
    runSynchronized(['lint', 'mocha']);
    return;
});

/*
 * Distribution related tasks
 */

gulp.task("build", function() {
  runSynchronized(['build:webpack', 'build:test', 'build:optimize']);
});


gulp.task("build:webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    webpack(myConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('build:test', function(callback) {
  webpack({
    entry: './test/browser/index.js',
    output : {
      path: __dirname + '/test/browser',
      filename: 'browser.js'
    },
    resolve: {
      alias: {
        'request': 'browser-request',
      }
    }
  }, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build:test", err);
    gutil.log("[webpack:build:test]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task("build:optimize", function(callback) {
  gulp.src('./dist/js/getstream.js')
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js_min'));
});

gulp.task('bump_package', function () {
  return gulp.src(['./package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('bump', function () {
  runSynchronized(['bump_package', 'write_bower']);
  return;
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

gulp.task('docs', function(done) {
  var p = child_process.exec('jsdoc -c .jsdoc',function(error, stdout, stderr) {
    if(error) {
      throw new gutil.PluginError({
        plugin: 'jsdoc',
        message: 'Something went wrong while executing the jsdoc command: ' + error
      })
    }
    done();
  });
});

gulp.task('tag', function () {
  var pkg = require('./package.json');
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  //git.tag(v, message, false, gutil.log);
  //git.commit('updated bower and npm', {args: '-a'});
  //git.push('origin', 'master', {args: '--tags'}).end();
});

// full release flow
gulp.task('release', function () {
	/*
	 * Instructions
	 * First you bump
	 * Then you build
	 * You commit the changes
	 * You tag using the syntax v1.0.1
	 * You push
	 * Npm publish .
	 */
	runSynchronized(['bump', 'build', 'tag']);
    return;
});

// full publish flow
gulp.task('publish', function () {
	runSynchronized(['build', 'test', 'release']);
    return;
});
