const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
// const rsync = require('gulp-rsync');
const del = require('del');


const imageswatch = 'jpg,jpeg,png,webp,svg';
const fileswatch = 'html,htm,txt,json,md,woff2';


function styles() {
    return src('app/users/sass/main.sass')
        .pipe(eval('sass')())
        .pipe(concat('app.min.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 15 versions', '> 1%', 'ie 8', 'ie 7', "android >= 4"], grid: true }))
        .pipe(cleancss({ level: { 1: { specialComments: 0 } }, /* format: 'beautify' */ }))
        .pipe(dest('app/users/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src(
            // 'app/users/libs/jquery/dist/jquery.js',
            // 'app/users/libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js',
            // // 'app/users/js/libs.js',
            // 'app/users/libs/jquery/dist/jquery.js',
            // 'app/users/libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js',
            'app/users/js/index.js'
        )
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(dest('app/users/js'))
        .pipe(browserSync.stream())
}

function libsJS() {
    return src([
            // 'app/users/libs/jquery/dist/jquery.js',
            // 'app/users/libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js',
            // 'app/users/js/libs.js',
            'app/users/libs/jquery/dist/jquery.js',
            'app/users/libs/OwlCarousel2-2.3.4/dist/owl.carousel.min.js',
            // 'app/users/libs/OwlCarousel2-2.3.4/dist/assets/owl.theme.default.js',
            // 'app/users/libs/slick-1.8.1/slick/slick.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(dest('app/users/js'))
}

function browsersync() {
    browserSync.init({
        server: { baseDir: ['app/users/', 'app/admin/'] },
        index: 'food.html',
        notify: false,
        online: true,
        // proxy: "localhost/foods"
    })
}


function images() {
    return src('app/users/images/src/**/*')
        .pipe(newer('app/users/images/dist/'))
        .pipe(imagemin())
        .pipe(dest('app/users/images/dist/'))
}

function cleanimg() {
    return del('app/users/images/dist/**/*', { force: true })
}

function startwatch() {
    watch('app/users/sass/**/*.sass', styles);
    watch('app/users/images/src/**/*.{' + imageswatch + '}', images);
    watch('app/**/*.{' + fileswatch + '}').on('change', browserSync.reload);
    watch('app/users/js/**/*.js').on('change', scripts);
}


exports.browsersync = browsersync;
exports.assets = series(cleanimg, styles, scripts, images);
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.cleanimg = cleanimg;
exports.default = parallel(images, libsJS, styles, scripts, browsersync, startwatch);