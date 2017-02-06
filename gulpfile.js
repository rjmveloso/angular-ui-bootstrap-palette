'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean'),
	header = require('gulp-header'),
	jshint = require('gulp-jshint'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify');

var SOURCE = './src/main/**'
var TARGET = './dist';

//using data from package.json 
var pkg = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('clean', function() {
	return gulp
    	.src(TARGET, {read: false})
    	.pipe(clean({force: true}))
    	.on('error', log);
});

gulp.task('lint', function () {
  return gulp.src(SOURCE)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build', ['clean', 'lint'], function() {
	gulp.src(SOURCE)
		.pipe(header(banner, { pkg: pkg }))
		.pipe(gulp.dest(TARGET))
		.pipe(uglify())
		.on('error', log)
		.pipe(rename({extname: '.min.js'}))
		.on('error', log)
		.pipe(gulp.dest(TARGET));
});

gulp.task('test', function(done) {
	
});

gulp.task('default', ['build']);