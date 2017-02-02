const path = require('path');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const coffeelint = require('gulp-coffeelint');
const coffee = require('gulp-coffee');
const karma = require('karma');

function clean() {
  return del(['./lib']);
}

function build() {
  gulp.src('./src/*.coffee')
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffee({
      bare: false
    }).on('error', gutil.log))
    .pipe(gulp.dest('./lib/'));
}

function runTests (singleRun, done) {

  const localConfig = {
    configFile: path.join(__dirname, './karma.conf.coffee'),
    singleRun: singleRun,
    autoWatch: !singleRun
  };

  const server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error(`Failed ${failCount} tests.`) : null);
  })
  server.start();
}

gulp.task('test', function(done) {
  runTests(true, done);
});

gulp.task('test:auto', function(done) {
  runTests(false, done);
});

gulp.task('build', build);
gulp.task('clean', clean);
gulp.task('default', ['clean', 'build']);
