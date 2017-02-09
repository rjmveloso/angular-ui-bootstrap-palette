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

var Server = require('karma').Server;

var SOURCE = 'src/**/*.js';
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

var configs = {
	minify: {
		empty: true,
		spare: true,
		quotes: true
	},
	template: {
		root: 'template/',
		module: 'angular.bootstrap.palette'
	}
}

gulp.task('default', ['build', 'test']);
gulp.task('build', ['clean', 'scripts']);
gulp.task('test', ['build', 'karma']);

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

gulp.task('scripts', ['lint'], function() {
	var scripts = gulp.src(SOURCE);
	
	var templates = gulp.src('src/**/*.html')
		.pipe(plumber({ errorHandler: handleError }))
    	.pipe(minify(configs.minify))
    	.pipe(template(configs.template));
	
	return merge(scripts, templates)
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(concat('palette.js'))
		.pipe(gulp.dest(TARGET))
		.pipe(uglify())
		.pipe(concat('palette.min.js'))
		.pipe(gulp.dest(TARGET));
});

gulp.task('karma', ['build'], function(done) {
	var karma = new Server({
		configFile: __dirname +'/karma.conf.js',
		autoWatch: false,
		singleRun: true
	}, done);
	karma.start();
});

var handleError = function (err) {
	console.log(err.toString());
	this.emit('end'); // required when using gulp.watch
};