// 1. LIBRARIES
// - - - - - - - - - - - - - - -
var $            = require('gulp-load-plugins')();
var gulp         = require('gulp');
var argv         = require('yargs').argv;
var browser      = require('browser-sync');
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var sequence     = require('run-sequence');
var rimraf       = require("rimraf");

// 2. VARIABLES
// - - - - - - - - - - - - - - -
// Check for --production flag
var isProduction = !!(argv.production);

// Port to use for the development server.
var PORT = 8000;

// Browsers to target when prefixing CSS.
var COMPATIBILITY = ['last 2 versions', 'ie >= 9'];

// File paths to various assets are defined here.
var PATHS = {
  assets: [
    'src/assets/**/*',
    '!src/assets/{!img,js,less}/**/*'
  ],
  less: [
    'bower_components/bootstrap/less',
    'bower_components/jasny-bootstrap/less',
    'src/less/**/*.less'
  ],
  javascript: [
    'bower_components/angular/angular.js',
    'bower_components/jquery/dist/jquery.js',
    'src/js/**/*.js'
  ]
};

//3. TASKS
// - - - - - - - - - - - - - - -

// Delete the "dist" folder
// This happens every time a build starts
gulp.task('clean', function(done) {
  rimraf('dist', done);
});

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
gulp.task('copy', function() {
  gulp.src(PATHS.assets)
    .pipe(gulp.dest('dist/assets'));
});

// Copy page templates into finished HTML files
gulp.task('pages', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'));
});

// Compiles Less
gulp.task('less', function () {
  return gulp.src('src/less/app.less')
    .pipe(less({
      paths: PATHS.less
    }))
    .pipe(autoprefixer({
			browsers: COMPATIBILITY,
			cascade: false
		}))
    .pipe(gulp.dest('dist/css/'));
});

// Combine JavaScript into one file
// In production, the file is minified
gulp.task('javascript', function() {
  var uglify = $.if(isProduction, $.uglify()
    .on('error', function (e) {
      console.log(e);
    })
);

  return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.concat('app.js'))
    .pipe(uglify)
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/js'));
});

// Copy images to the "dist" folder
// In production, the images are compressed
gulp.task('images', function() {
  var imagemin = $.if(isProduction, $.imagemin({
    progressive: true
  }));

  return gulp.src('src/assets/img/**/*')
    .pipe(imagemin)
    .pipe(gulp.dest('dist/assets/img'));
});

// Start a server with LiveReload to preview the site in
gulp.task('server', ['build'], function() {
  browser.init({
    server: 'dist', port: PORT
  });
});

// Build the "dist" folder by running all of the above tasks
gulp.task('build', function(done) {
  sequence('clean', ['less', 'javascript', 'images', 'pages'], done);
});

// Build the  site, run the server, and watch for file changes
gulp.task('default', ['build', 'server'], function() {
  gulp.watch(PATHS.assets, ['copy', browser.reload]);
  gulp.watch(['src/**/*.html'], ['pages', browser.reload]);
  gulp.watch(['src/less/**/*.less'], ['less', browser.reload]);
  gulp.watch(['src/js/**/*.js'], ['javascript', browser.reload]);
  gulp.watch(['src/assets/img/**/*'], ['images', browser.reload]);
});
