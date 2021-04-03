/*
Required plugins:

npm i -D gulp-load-plugins gulp-sass gulp-sourcemaps gulp-postcss autoprefixer browser-sync gulp-newer gulp-imagemin gulp-svg-sprite

*/

'use strict';

//General settings
global.$ = {
	gulp: require('gulp'),
	gp: require('gulp-load-plugins')({ //To add pugins using gp
		pattern: '*'
		}),

	path: {
		tasks: require('./gulp/config/tasks.js')		
	},

	build: {
	        html: './public/',	        
	        styles: './public/css/',
	        img: './public/img/',
	        sprites: './public/img/sprites/',
	        fonts: './public/fonts/'	        	        
		},

	src: {
		html: './app/template/',
		styles: './app/styles/',
		img: './app/img/',
		sprites: './app/img/sprites/',
		fonts: './app/fonts/'
	}
}

//Iterate defined tasks in config/tasks.js and add them
 $.path.tasks.forEach((taskPath) => {
 	require(taskPath)();
 })


//Default task for Gulp that runs and watch: 'image', 'svg', 'styles', 'browser-sync'
$.gulp.task('default', $.gulp.series(
	$.gulp.parallel('html', 'image', 'svg'),
	'styles',
	$.gulp.parallel('watch', 'browser-sync')	
	));

//Task for production
$.gulp.task('build', $.gulp.series(
	$.gulp.parallel('html:prod', 'image:prod', 'svg:prod'),
	'styles:prod'
	));