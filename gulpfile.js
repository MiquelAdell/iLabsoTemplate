// Define dependencies
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var wiredep = require('wiredep').stream;


// variables
var input = './src/main.scss';
var dependencies = './src/sass/**/*.scss';
var outputDir = './dist/styles/';
var outputFile = './dist/';

var sassOptions = {
	errLogToConsole: true,
	outputStyle: 'expanded'
};


gulp.task('styles', function(){
	var injectAppFiles = gulp.src(dependencies, {read: false});

	function transformFilepath(filepath) {
		return '@import "' + filepath + '";';
	}

	var injectAppOptions = {
		transform: transformFilepath,
		starttag: '// inject:app',
		endtag: '// endinject',
		addRootSlash: false
	};

	return gulp
	.src(input)
	.pipe(wiredep())
	.pipe(inject(injectAppFiles, injectAppOptions))
	.pipe(sourcemaps.init())
	.pipe(sass(sassOptions).on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(autoprefixer())
	.pipe(gulp.dest(outputDir));
});

gulp.task('watch', function() {
	return gulp
	// Watch the input folder for change,
	// and run `sass` task when something happens
	.watch(input, ['styles'])
	// When there is a change,
	// log a message in the console
	.on('change', function(event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});

gulp.task('html', ['styles'], function(){
	var injectFiles = gulp.src([outputDir + outputFile]);

	var injectOptions = {
		addRootSlash: false,
		ignorePath: ['src', 'dist']
	};

	return gulp.src('src/index.html')
	.pipe(inject(injectFiles, injectOptions))
	.pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass', 'watch']);

gulp.task('build', function () {
	return gulp
	.src(input)
	.pipe(sass({ outputStyle: 'compressed' }))
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(gulp.dest(output));
});
