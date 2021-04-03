
/*
Required plugins:
npm i -D gulp-load-plugins gulp-sass gulp-sourcemaps gulp-postcss autoprefixer browser-sync gulp-newer

*/
'use strict';

$.gp.sass.compiler = require('node-sass'); //Sass compiler (sass pluign)
const tildeImporter = require('node-sass-tilde-importer');
let gulpResolveUrl = require('gulp-resolve-url');

module.exports = () => {

	$.gulp.task('styles', () => {

			return $.gulp.src(`${$.src.styles}main.scss`)
			.pipe($.gp.sourcemaps.init()) //Init sourcemaps
			.pipe($.gp.newer($.build.styles)) //Check newer files			
			.pipe($.gp.sass({
				outputStyle: 'expanded',
				importer: tildeImporter
			}).on('error', $.gp.sass.logError)) //Sass to CSS		
			.pipe($.gp.sourcemaps.write()) //Write sourcemaps			
			.pipe($.gp.postcss([ $.gp.autoprefixer() ])) // add vendor prefixes to CSS
			.pipe($.gulp.dest($.build.styles))
			.pipe($.gp.browserSync.stream()) //reload browser

	});

	$.gulp.task('styles:prod', () => {

			return $.gulp.src(`${$.src.styles}main.scss`)			
			.pipe($.gp.sass({
				outputStyle: 'compressed',
				importer: tildeImporter
			}).on('error', $.gp.sass.logError)) //Sass to CSS
			.pipe($.gp.postcss([ $.gp.autoprefixer() ])) // add vendor prefixes to CSS
			.pipe($.gulp.dest($.build.styles))
	});			
};