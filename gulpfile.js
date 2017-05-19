//TODO: Maybe remove jquery?
//TODO: add dist task


// Define dependencies
var autoprefixer   = require('gulp-autoprefixer');
var browserSync    = require('browser-sync').create();
var concat         = require('gulp-concat');
var cleanCSS       = require('gulp-clean-css');
var del            = require('del');
var filter         = require('gulp-filter');
var gulp           = require('gulp');
var imagemin       = require('gulp-imagemin');
var inject         = require('gulp-inject');
var mainBowerFiles = require('main-bower-files');
var notify         = require('gulp-notify');
var sass           = require('gulp-sass');
var sourcemaps     = require('gulp-sourcemaps');
var uglify         = require('gulp-uglify');
var wiredep        = require('wiredep').stream;
var runSequence    = require('run-sequence');
var zip            = require('gulp-zip');




var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'compressed'
};

gulp.task('styles', function(){
	var injectAppFiles = gulp.src('./src/styles/**/*.scss', {read: false});
	var injectGlobalFiles = gulp.src('./src/global/**/*.scss', {read: false});

	function transformFilepath(filepath) {
		return '@import "' + filepath + '";';
	}

	var injectAppOptions = {
		transform: transformFilepath,
		starttag: '// inject:app',
		endtag: '// endinject',
		addRootSlash: false
	};

	var injectGlobalOptions = {
		transform: transformFilepath,
		starttag: '// inject:global',
		endtag: '// endinject',
		addRootSlash: false
	};
	return gulp
		.src('./src/main.scss')
		.pipe(wiredep())
		.pipe(inject(injectGlobalFiles, injectGlobalOptions))
		.pipe(inject(injectAppFiles, injectAppOptions))
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(autoprefixer())
		.pipe(concat('main.css'))
		.pipe(gulp.dest('./dist/styles/'))
		.pipe(browserSync.stream());
});


gulp.task('vendor-styles', function(){
	return gulp
		.src(mainBowerFiles())
		.pipe(filter('**/*.css'))
		.pipe(concat('vendor.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist/styles'));
});

gulp.task('vendor-scripts', function(){
	return gulp
		.src(mainBowerFiles())
		.pipe(filter('**/*.js'))
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/scripts'));
});

// Run:
// gulp scripts.
// Uglifies and concat all JS files into one
gulp.task('scripts', function() {
	var sources = [
		'./src/scripts/template.js',
		'./src/scripts/main.js'
	];
	gulp.src(sources)
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task( 'icons', function(){
	return gulp
		.src('./bower_components/font-awesome/fonts/**.*')
		.pipe(gulp.dest('./dist/fonts/'));
});

// ### Images
// `gulp images` - Run lossless compression on all the images.
gulp.task('images', function() {
  return gulp.src('./src/images/**')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
    }))
    .pipe(gulp.dest('./dist/images'))
    .pipe(browserSync.stream());
});


// ### Watch
// `gulp watch` - Use BrowserSync to proxy your dev server and synchronize code
// changes across devices. Specify the hostname of your dev server at
// `manifest.config.devUrl`. When a modification is made to an asset, run the
// build step for that asset and inject the changes into the page.
// See: http://www.browsersync.io
gulp.task('watch', function() {
  browserSync.init({
    proxy: "http://limesurvey.dev/templates/ilabsoTemplate/test/",
  });
  gulp.watch(['./src/styles/**/*'], ['styles']);
  gulp.watch(['./src/global/**/*'], ['styles']);
  gulp.watch(['./main.scss'], ['styles']);
  gulp.watch(['./src/scripts/**/*'], ['scripts']);
  gulp.watch(['bower.json', 'assets/manifest.json'], ['build']);
});

gulp.task('clean', function(cb){
	return del(['dist','barometre-tecer-sector-social.zip'], cb);
});

gulp.task('build', function (cb) {
  runSequence('clean', ['vendor-styles', 'vendor-scripts', 'styles', 'scripts', 'icons', 'images'], cb);
});

gulp.task('zip', function (cb) {
  runSequence('build', ['do-zip'], cb);
});

gulp.task('do-zip', function(cb){
	return gulp
		.src(
			[
				'**',
				'!bower_components/',
				'!bower_components/**',
				'!node_modules/',
				'!node_modules/**',
				'!src/',
				'!src/**',
				'!test/',
				'!test/**',
				'!.*',
				'!gulpfile.js',
				'!package.json',
				'!bower.json',
				'!./dist/fonts/FontAwesome.otf'
			]
		)
        .pipe(zip('barometre-tecer-sector-social.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['build']);
