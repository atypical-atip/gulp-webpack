//Watching for any changes
'use strict'


module.exports = () => {
		$.gulp.task('watch', function(){
		$.gulp.watch( `${$.src.styles}**/*.scss`, $.gulp.series('styles') ) //Watching Sass and Sass files
		$.gulp.watch( `${$.src.img}*.{png, jpg}`, $.gulp.series('image') ) //Watch images, mimfy and copy to destination
		$.gulp.watch( `${$.src.sprites}*.svg`, $.gulp.series('svg') ) //Watch svg files, create sprite, css file and copy
		$.gulp.watch( `${$.src.html}**/*.html`, $.gulp.series('html') ) //Watch html files and copy
	});
}
