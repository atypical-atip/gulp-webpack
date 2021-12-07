import gulp from 'gulp';
import yargs from 'yargs'; //To check production mode
import sass from 'gulp-sass'; //ScSS to CSS
import cleanCSS from 'gulp-clean-css';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin';
import del from 'del'; // clean destination folder
import webpack from 'webpack-stream'; //Webpack
import named from 'vinyl-named'; //To include multiple entry points in webpack
import browserSync from 'browser-sync';
// plugins for SVG
import svgmin from 'gulp-svgmin';
import svgSprite from 'gulp-svg-sprite';
import replace from 'gulp-replace';
import cheerio from 'gulp-cheerio'; //clear unnecessary attributes in svg sprite

// ========= CHANGE THESE OPTIONS BEFORE YOU START ======
// Check production mode
const PRODUCTION = yargs.argv.prod;

const phpMode = true;
const siteDomain = "harley.local";
// ========= OPTIONS END ======


const paths = {
    styles: {
        src: [
            'src/scss/style.scss'
        ],
        dest: 'public/css'
    },

    icons: {
        src: 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
        dest: 'public/fonts/font-awesome/'
    },

    images: {
        src: 'src/images',
        dest: 'public/images'
    },

    svg: {
        src: 'src/images/svg',
        dest: 'public/images/'
    },

    scripts: {
        src: 'src/js/bundle.js',
        dest: 'public/js'
    },

    php: {
        src: 'src/php',
        dest: 'public'
    },

    other: {
        src: ['src/**/*', '!src/{images,js,scss}', '!src/{images,js,scss}/**/*'],
        dest: 'public'
    }
}

// BrowserSync

const server = browserSync.create();
export const serve = done => {
    if (phpMode) {
        server.init({
            proxy: siteDomain
        });
        done();
    } else {
        server.init({
            server: {
                baseDir: "./public/"
            }
        });
        done();
    }

}

export const reload = done => {
    server.reload();
    done();
}

// Clean destination folder before running other tasks
export const clean = () => del(['assets']);

// SCSS styles
export const styles = () => {
    return gulp.src(paths.styles.src)
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(
            PRODUCTION,
            cleanCSS({
                compatibility: 'ie8'
            })
        ))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(server.stream());
}

// Minify images
export const images = () => {
    return gulp.src(`${paths.images.src}/*.{jpg,jpeg,svg,png,gif}`)
        .pipe(gulpif(
            PRODUCTION,
            imagemin()
        ))
        .pipe(gulp.dest(paths.images.dest));
}

// Copy assets
export const copy = () => {
    return gulp.src(paths.other.src)
        .pipe(gulp.dest(paths.other.dest));
}

// Copy PHP
export const copyPHP = () => {
    return gulp.src(`${paths.php.src}/**/*.php`)
        .pipe(gulp.dest(paths.php.dest));
}

//Copy fontawesome icons
export const icons = () => {
    return gulp.src(paths.icons.src)
        .pipe(gulp.dest(paths.icons.dest));
}

/* Create SVG sprite*/

const svgConfig = {
    mode: {
        // Create a «symbol» sprite
        symbol: {
            dest: paths.svg.dest,
            sprite: `sprite.svg`
        }
    }
}

export const svg = () => {
    return gulp.src(`${paths.svg.src}/**/*.svg`)

    //Minify svg in prduction mode
    .pipe(gulpif(PRODUCTION, svgmin()))

    //Remove attributes
    .pipe(cheerio({
            run: function($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite(svgConfig))
        .pipe(gulp.dest(`.`));

}

// Webpack
export const scripts = () => {
    return gulp.src(paths.scripts.src)
        // .pipe(named())
        .pipe(webpack({
            module: {
                rules: [{
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }]
            },
            output: {
                filename: '[name].js'
            },
            devtool: !PRODUCTION ? 'inline-source-map' : false,
            mode: PRODUCTION ? 'production' : 'development'
        }))
        .pipe(gulp.dest(paths.scripts.dest));
}

// Watch task
export const watch = () => {
    gulp.watch(`src/scss/**/*.scss`, styles);
    gulp.watch(`src/**/*.js`, gulp.series(scripts, reload));
    gulp.watch('src/*.html', gulp.series(copy, reload)); //watch and copy html files
    gulp.watch(`${paths.images.src}/*.{jpg,jpeg,svg,png,gif}`, gulp.series(images, reload));
    gulp.watch(`${paths.svg.src}/**/*.svg`, gulp.series(svg, reload));
    gulp.watch(`${paths.other.src}`, gulp.series(copy, icons, reload));
    gulp.watch(`${paths.php.src}/**/*.php`, gulp.series(copyPHP, reload));
}

// Development task
export const dev = gulp.series(clean,
    gulp.parallel(
        styles,
        images,
        svg,
        scripts,
        copy,
        icons
    ), gulp.parallel(serve, watch)
);

// Production task
export const build = gulp.series(clean,
    gulp.parallel(
        styles,
        images,
        svg,
        scripts,
        copy,
        icons
    )
);

export default dev;