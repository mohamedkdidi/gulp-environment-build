'use strict';
	
// Requirement

// Gulp	
var gulp = require('gulp');

// Sass/CSS stuff
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');

// JavaScript
var uglify = require('gulp-uglify');

// Images
var svgmin = require('gulp-svgmin');
var imagemin = require('gulp-imagemin');

// Stats and Things
var size = require('gulp-size');

// Livereload server
var livereload = require('gulp-refresh');
var http = require('http');
var st = require('st');

// Plugin gulp to build blocks in the HTML
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var clean = require('gulp-clean');

// Plugin gulp to zip dist folder
var zip = require('gulp-zip');

var jsfilter = filter('**/*.js');
var cssfilter = filter('**/*.css');

// Gulp task

// compile all your Sass
gulp.task('sass', function (){
	gulp.src(['./src/sass/*.scss', '!./src/sass/_variables.scss'])
		.pipe(sass({
			includePaths: ['./src/sass'],
			outputStyle: 'expanded'
		}))
		.pipe(prefix(
			"last 1 version", "> 1%", "ie 8", "ie 7"
			))
		.pipe(gulp.dest('./src/css'))
		.pipe(minifycss())
		.pipe(gulp.dest('./dist/css'))
		.pipe(livereload());
});

// Uglify JS
gulp.task('uglify', function(){
	gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/js'))
		.pipe(livereload());
});

// HTML
gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Images
gulp.task('svgmin', function() {
	gulp.src('./src/img/svg/*.svg')
	.pipe(svgmin())
	.pipe(gulp.dest('./src/img/svg'))
	.pipe(gulp.dest('./dist/img/svg'));
});

gulp.task('imagemin', function () {
	gulp.src('./src/img/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./src/img'))
	.pipe(gulp.dest('./dist/img'));
});

// Stats and Things
gulp.task('stats', function () {
	gulp.src('./dist/**/*')
	.pipe(size())
	.pipe(gulp.dest('./dist'));
});


// clean dist folder
gulp.task('clean', function(){
	return gulp.src('dist', { read: false }).pipe(clean())
});

// archive dist folder 
gulp.task('zip', ['default'], function(){
	gulp.src('dist/**/*')
	.pipe(zip('dist.zip'))
	.pipe(gulp.dest('.'));
})
// default task just run />$ gulp

gulp.task('watch', function(){
	livereload.listen({port: '8080', host: 'localhost', start: true, index: __dirname + '/dist/index.html' });
	// watch me getting Sassy
	gulp.watch("./src/sass/**/*.scss", ['sass']).on('change', function(event){
		console.log('file changed ' + event.path);
	});
	// make my JavaScript ugly
	gulp.watch('./src/js/**/*.js', ['uglify']).on('change', function(event){
		console.log('file changed '+ event.path);
	});
	// images
	gulp.watch('./src/img/**/*', ['imagemin', 'svgmin']).on('change', function(event){
		console.log('file changed ' + event.path);
	});
	// HTML
	gulp.watch('./src/*.html', ['html']).on('change', function(event){
		console.log('file changed ' + event.path);
	});
});


gulp.task('default', ['sass', 'uglify', 'imagemin', 'svgmin', 'html' ], function(done) {
	http.createServer(
		st({ path: __dirname + '/dist', index: 'index.html', cache: false })
	).listen(8080, done);
});
