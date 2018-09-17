var gulp = require('gulp');
var gutil = require('gulp-util');

gulp.task('log', function() {
  gutil.log('== My Log Task ==')
});

// include the required packages.
var gulp = require('gulp');
var data = require('gulp-data');
var stylus = require('gulp-stylus');

// include, if you want to work with sourcemaps
// var sourcemaps = require('gulp-sourcemaps');

// Stylus to CSS
gulp.task('one', function () {
  return gulp.src('style.styl')
    .pipe(stylus())
        .on('error', gutil.log)
    .pipe(gulp.dest('dist/'));
});

// Stylus compress to CSS
gulp.task('compress', function () {
  return gulp.src('style.styl')
    .pipe(stylus({
      compress: true
    }))
        .on('error', gutil.log)
    .pipe(gulp.dest('dist/'));
});


//JS
var uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

gulp.task('js', function() {
  gulp.src('scripts/*.js')
  .pipe(uglify())
  // .pipe(concat('scripts.js'))
  .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
  gulp.watch('scripts/*.js', ['js']);
  gulp.watch('stylus/*.styl', ['compress']);
});

gulp.task('default', ['compress', 'js', 'watch'])
