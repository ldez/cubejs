const path = require('path');
const del = require('del');
const gulp = require('gulp');
const gutil = require('gulp-util');
const coffeelint = require('gulp-coffeelint');
const coffee = require('gulp-coffee');
const karma = require('karma');

const paths = {
  src: 'src',
  dist: 'lib',
  demo: 'docs'
};

function clean() {
  return del([`./${paths.dist}`]);
}

function buildCoffee(dest) {
  gulp.src(`./${paths.src}/*.coffee`)
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
    .pipe(coffee({
      bare: false
    }).on('error', gutil.log))
    .pipe(gulp.dest(dest));
}

function build() {
  buildCoffee(`./${paths.dist}/`);
}

function runTests(singleRun, done) {

  const localConfig = {
    configFile: path.join(__dirname, './karma.conf.coffee'),
    singleRun: singleRun,
    autoWatch: !singleRun
  };

  const server = new karma.Server(localConfig, function(failCount) {
    done(failCount ? new Error(`Failed ${failCount} tests.`) : null);
  });
  server.start();
}

function cleanDemo() {
  return del([`./${paths.demo}/lib`]);
}

function demo() {
  buildCoffee(`./${paths.demo}/lib/`);
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

gulp.task('demo:clean', cleanDemo);
gulp.task('demo:build', ['demo:clean'], demo);
