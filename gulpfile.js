// 1. LIBRARIES
// - - - - - - - - - - - - - - -
var less = require('gulp-less');
var path = require('path');
var gulp = require('gulp');

// 2. FILE PATHS
// - - - - - - - - - - - - - - -
var paths = {
  assets: [
    './client/**/*.*',
    '!./client/templates/**/*.*',
    '!./client/assets/{scss,js}/**/*.*'
  ],
  less: [
    'node_modules/bootstrap/less/',
    'node_modules/jasny-bootstrap/less/',
    'src/less'
  ],
  js: [

  ]
};

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('less', function () {
  return gulp.src('src/less/app.less')
    .pipe(less({
      paths: paths.less
    }))
    .pipe(gulp.dest('dist/css/'));
});
