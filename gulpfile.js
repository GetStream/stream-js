var gulp = require('gulp')
  , gutil = require('gulp-util')
  , jshint = require('gulp-jshint')
  , jscs = require('gulp-jscs')
  , stylish = require('gulp-jscs-stylish')
  , mocha = require('gulp-mocha')
  , fs = require('fs')
  , uglify = require('gulp-uglify')
  , async = require('async')
  , webpack = require("webpack")
  , webpackConfig = require('./webpack.config.js')
  , child_process = require('child_process');


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
    return gulp.src(['./test/unit/index.js'], {read: false})
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
    runSynchronized(['mocha']);
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
    node: {
        fs: 'empty',
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
