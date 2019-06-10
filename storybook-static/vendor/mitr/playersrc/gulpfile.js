var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  watch = require('gulp-watch'),
  del = require('del'),
  babel = require('gulp-babel');

gulp.task('main', function () {
  return gulp.src(['src/core/lib/**/*.js', 'src/core/main/**/*.js'])
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('single-file-entry.js'))
    .pipe(gulp.dest('dist'))
});


gulp.task('sync', function () {
  return gulp.src(['src/**', '!src/core/**/*.js', '!src/core/lib', '!src/core/main'])
    .pipe(gulp.dest('dist'))
});

gulp.task('distribute', function () {
  return gulp.src('dist/**')
    .pipe(gulp.dest('../bdl-me_and_you/player'))
    .pipe(gulp.dest('../bdl-animals/player'))
    .pipe(gulp.dest('../bdl-colors/player'))
    .pipe(gulp.dest('../bdl-people/player'))
    .pipe(gulp.dest('../bdl-shapes/player'));
});

// Watch
gulp.task('watch', function () {
  gulp.watch('dist/**', gulp.series('distribute'));
  gulp.watch(['src/core/lib/**/*.js', 'src/core/main/**/*.js'], gulp.series('main'));
  gulp.watch(['src/**', '!src/core/**/*.js', '!src/core/lib', '!src/core/main'], gulp.series('sync'));
});

// Clean
gulp.task('clean', function () {
  return del([
    'dist'
  ], {
    "force": true
  });
});

gulp.task('default', gulp.series('clean',
  gulp.parallel('main', 'sync'),
  'distribute'
));

// Dev
gulp.task('dev', gulp.series('watch'));
