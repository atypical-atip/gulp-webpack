// Static server + watching

module.exports = () => {

	$.gulp.task('browser-sync', () => {
	    $.gp.browserSync.init({
	        server: {
	            baseDir: $.build.html
	        }
	    });    

    	$.gulp.watch( `${$.src.html}*.html` ).on('change', $.gp.browserSync.reload); //Reload on change

	});

}