/*Task for creating SVG sprite*/

const svgConfig = {
  mode: {
    // Create a «symbol» sprite
    symbol: {
      dest: `${$.build.img}/svg/`,
      sprite: `sprite.svg`
    }
  }
}

module.exports = function () {

  $.gulp.task('svg', function () {

    return $.gulp.src(`${$.src.sprites}**/*.svg`)
      //Minify svg
      .pipe($.gp.svgmin({
        js2svg: {
          pretty: true
        }
      }))

      //Remove attributes
      .pipe($.gp.cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
      }))
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe($.gp.replace('&gt;', '>'))
      .pipe($.gp.svgSprite(svgConfig))
      .pipe($.gp.debug({ title: `svg:` }))
      .pipe($.gulp.dest(`.`));

  });

  $.gulp.task('svg:prod', function () {

    return $.gulp.src(`${$.src.sprites}**/*.svg`)
      //Minify svg
      .pipe($.gp.svgmin({
        js2svg: {
          pretty: true
        }
      }))
      //Remove attributes
      .pipe($.gp.cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true }
      }))
      // cheerio plugin create unnecessary string '&gt;', so replace it.
      .pipe($.gp.replace('&gt;', '>'))
      .pipe($.gp.svgSprite(svgConfig))
      .pipe($.gulp.dest(`.`));

  });
}
