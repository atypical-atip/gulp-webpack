module.exports = function(){

	$.gulp.task('static', function(){
		
		return $.gulp.src( `${$.src.static}**/*.*` )
		.pipe($.gp.newer( $.build.html )) // Add the newer pipe to pass through newer files only
		.pipe( $.gulp.dest( $.build.html ));

	});

		$.gulp.task('static:prod', function(){

		return $.gulp.src( `${$.src.static}**/*.*` )		
		.pipe( $.gulp.dest( $.build.html ));

	});
}