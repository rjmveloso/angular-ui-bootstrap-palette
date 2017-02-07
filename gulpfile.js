'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	merge = require('gulp-merge'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	header = require('gulp-header'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	minify = require('gulp-minify-html'),
	template = require('gulp-angular-templatecache');

var SOURCE = 'src/main/**/*.js'
var TARGET = 'dist';

//using data from package.json 
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('default', ['build', 'test']);
gulp.task('build', ['clean', 'lint', 'scripts']);

gulp.task('clean', function() {
	return gulp
    	.src(TARGET, {read: false})
    	.pipe(clean({force: true}));
});

gulp.task('lint', function() {
  return gulp.src(SOURCE)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', function() {
	var scripts = gulp.src(SOURCE);
	
	var templates = gulp.src('src/**/*.html')
		.pipe(plumber({ errorHandler: handleError }))
    	.pipe(minify({empty: true, spare: true, quotes: true}))
    	.pipe(template({module: 'angular-bootstrap-palette'}));
	
	return merge(scripts, templates)
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(concat('palette.js'))
		.pipe(gulp.dest(TARGET))
		.pipe(uglify())
		.pipe(concat('palette.min.js'))
		.pipe(gulp.dest(TARGET));
});

gulp.task('test', function(done) {
	
});

var handleError = function (err) {
	console.log(err.toString());
	this.emit('end'); // required when using gulp.watch
};