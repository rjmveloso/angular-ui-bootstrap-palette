'use strict';

var gulp = require('gulp'),
	argv = require('minimist'),
	clean = require('gulp-clean'),
	merge = require('gulp-merge'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber');

var header = require('gulp-header'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-cssmin'),
	htmlmin = require('gulp-htmlmin'),
	template = require('gulp-angular-templatecache');

var bump = require('gulp-bump'),
	changelog = require('gulp-conventional-changelog');

var KarmaServer = require('karma').Server,
	KarmaConfig = require('karma/lib/config').parseConfig;

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
	htmlmin: {
		collapseWhitespace: true
	},
	template: {
		root: 'template/',
		module: 'angular.bootstrap.palette'
	},
	karma: {
		configFile: __dirname + '/karma.conf.js',
		autoWatch: false,
		singleRun: true
	}
}

gulp.task('default', ['build', 'test']);
gulp.task('build', ['scripts', 'styles']);
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

gulp.task('scripts', ['clean', 'lint'], function() {
	var templates = function() {
		return gulp.src('src/**/*.html')
			.pipe(plumber({ errorHandler: handleError }))
    			.pipe(htmlmin(configs.htmlmin))
    			.pipe(template(configs.template));
	};
	
	return merge(gulp.src(SOURCE), templates())
		.pipe(plumber({ errorHandler: handleError }))
		.pipe(concat('palette.js'))
		.pipe(header(banner, { pkg: pkg }))
		.pipe(gulp.dest(TARGET))
		.pipe(uglify())
		.pipe(concat('palette.min.js'))
		.pipe(gulp.dest(TARGET));
});

gulp.task('styles', ['clean'], function() {
	return gulp.src(['src/palette.css'], {base: 'src'})
	    .pipe(concat('palette.css'))
	    .pipe(header(banner, { pkg: pkg }))
	    .pipe(gulp.dest(TARGET))
	    .pipe(cssmin())
	    .pipe(concat('palette.min.css'))
	    .pipe(gulp.dest(TARGET));
});


// testing
gulp.task('karma', ['build'], function(done) {
	karma(configs.karma.configFile, done);
});


// versioning
var types = ['major', 'minor', 'patch', 'prerelease'];

function getBumpType() {
	var type = (arg['type'] || 'patch');
	
	// includes => ecmascript 6
	if (!types.includes(type)) {
		throw "Unrecognized bumptype '" + type + "'.";
	}
	return type;
}

// see commitizen to get prompt
gulp.task('changelog', function() {
	return gulp.src('CHANGELOG.md', {buffer: false})
    	.pipe(changelog({preset: 'angular'}))
    	.pipe(gulp.dest('./'));
});

gulp.task('release:bump', function() {
	var type = getBumpType();
	gulp.src('./package.json')
		.pipe(bump({type: type}))
		.pipe(gulp.dest('./'));
});

//gulp.task('release:tag', function() {
//	
//});

//gulp.task('release:push', function() {
//	
//})

gulp.task('release', ['test', 'relase:bump'], function() {
	//tag
	//push
});


// watching
gulp.task('watch', ['build', 'karma-watch'], function() {
	gulp.watch(['src/**/*.{js,html}'], ['build']);
});

gulp.task('karma-watch', ['build'], function(cb) {
	karma(configs.karma.configFile, {singleRun: false}, cb);
});

function karma(configFile, configOpts, cb) {
	//var params = KarmaConfig(configFile, configOpts || {});
	//var karma = new KarmaServer(params, cb);
	var karma = new KarmaServer(configs.karma, cb);
	karma.start();
}


var handleError = function (err) {
	console.log(err.toString());
	this.emit('end'); // required when using gulp.watch
};