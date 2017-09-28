/**
 * Packages
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-minify');
var autoprefixer = require('gulp-autoprefixer');
var argv = require('yargs').argv;
var modifyCssUrls = require('gulp-modify-css-urls');
var imagemin = require('gulp-imagemin');


/**
 * Settings
 */
var settings = {
  assetsPath: '/themes/custom/globant_corp_theme/',
  environments: {
    dev: {
      name: 'DEVELOPMENT',
      assetsBasePath: ''
    },
    prod: {
      name: 'PRODUCTION',
      assetsBasePath: '//d3rfyrntdtutvw.cloudfront.net'
    },
    qc: {
      name: 'QC',
      assetsBasePath: '//durpv811fknlu.cloudfront.net'
    },
    uat: {
      name: 'UAT',
      assetsBasePath: '//durpv811fknlu.cloudfront.net'
    }
  },
  currentEnv: {}
};


/**
 * Paths
 */
var paths = {
  fonts: {
    input: [
      'node_modules/font-awesome/fonts/*',
      'node_modules/bootstrap-sass/assets/fonts/bootstrap/*',
      'node_modules/slick-carousel/slick/fonts/*'
    ],
    output: 'fonts/'
  },
  styles: {
    input: 'sass/**/*.scss',
    output: 'css/'
  },
  scripts: {
    input: [
      // Libraries
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/jquery-validation/dist/jquery.validate.js',
      // Modules
      'js/modules/lazyload.js',
      // Others
      'js/globant-corp.js' // TODO: Split this file into smaller modules
    ],
    output: 'dist/',
    outputFilename: 'globant-corp.main.js'
  },
  images: {
    input: 'images/**/*',
    output: 'images/'
  }
};


/**
 * Utilities
 */

/**
 * Set the current environment based on the parameter passed to the task
 *
 * Environment parameters:
 * [Development] <no parameter needed>
 * [Production]  --prod
 * [QC]          --qc
 * [UAT]         --uat
 */
function setCurrentEnvironment() {
  var envKey;

  if (argv.prod) {
    envKey = 'prod';
  } else if (argv.qc) {
    envKey = 'qc';
  } else if (argv.uat) {
    envKey = 'uat';
  } else {
    envKey = 'dev';
  }

  settings.currentEnv = settings.environments[envKey];
}

/**
 * Replace CSS URLs based on the current environment
 * @return {function} The function to be passed to gulp pipe
 */
function replaceCssUrls() {
  return modifyCssUrls({
    modify(url, filePath) {
      return url.replace(/^\.\.\//gi, settings.assetsPath);
    },
    prepend: settings.currentEnv.assetsBasePath
  });
}


/**
 * Taks
 */

// Fonts
// Manually run this task every time a new font pack is added
gulp.task('fonts', function() {
  return gulp.src(paths.fonts.input)
    .pipe(gulp.dest(paths.fonts.output));
});

// Styles
gulp.task('styles', function() {
  gulp.src(paths.styles.input)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], remove: false, cascade: false }))
    .pipe(replaceCssUrls())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.output));
});

// Scripts
gulp.task('scripts', function() {
  gulp.src(paths.scripts.input)
    .pipe(concat(paths.scripts.outputFilename))
    .pipe(minify({
      ext:{
        src:'-debug.js',
        min:'.js'
      },
      ignoreFiles: ['.min.js', '-min.js']
    }))
    .pipe(gulp.dest(paths.scripts.output));
});

// Images
gulp.task('images', function () {
  gulp.src(paths.images.input)
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest(paths.images.output));
});

// Update settings
gulp.task('update-settings', function () {
  setCurrentEnvironment();
});

// Build
gulp.task('build', ['update-settings', 'styles', 'scripts'], function () {
  console.log('Environment: ' + settings.currentEnv.name);
});

// Watch
gulp.task('watch', ['build'], function() {
  gulp.watch(paths.styles.input, ['styles']);
  gulp.watch(paths.scripts.input, ['scripts']);
});

// Default
gulp.task('default', ['build']);
