// definieren preprocessor
let preprocessor = 'scss';
let preprocessorFolder = 'sass';


const { src, dest, parallel, series, watch } = require('gulp'); // definieren die Constants
const browserSync   = require('browser-sync').create(); // browsersync anschalten
const concat        = require('gulp-concat'); // gulp-concat anschalten
const uglify        = require('gulp-uglify-es').default; // gulp-uglify anschalten
const scss          = require('gulp-sass'); // gulp-sass und gulp-less anschalten
const less          = require('gulp-less');
const autoprefixer  = require('gulp-autoprefixer'); // autoprefixer anschalten
const cleancss      = require('gulp-clean-css'); // gulp-clean-css anschalten
const imagemin      = require('gulp-imagemin'); // Anschalten gulp-imagemin für die Arbeit mit den Bilder
const newer         = require('gulp-newer'); // Anschalten gulp-newer
const del           = require('del'); // Anschalten del
const htmlValidator = require('gulp-w3c-html-validator');
const plumber       = require('gulp-plumber');
const pug           = require('gulp-pug');
const argv          = require('yargs').argv;
const gulpif        = require('gulp-if');
const htmlbeautify  = require('gulp-html-beautify');

function pug2html() {
    return src('frontend/src/templates/*.pug')
        .pipe(plumber())
        .pipe(pug())
        .pipe(plumber.stop())
        .pipe(gulpif(argv.prod, htmlValidator()))
        .pipe(htmlbeautify())
        .pipe(dest('frontend/prod'))
}

// "Browsersync-Logik" beschreiben
function browsersync() {
    browserSync.init({ //Initialization Browsersync
        server: {baseDir: 'frontend/prod'}, // Definieren Server-Ordner
        notify: false, // Die Anzeigen ausschalten
        online: true, // Betriebsmodus true oder false
    })
}

// die Funktion für scripts aufbauen
function scripts() {
    return src([ //Nehmen die Dateien aus Quellen
        'frontend/src/scripts/components/**/*.js',
        'frontend/src/scripts/features/**/*.js',
    ])
        .pipe(concat('all.min.js')) // Konvertieren in einer Datei
        .pipe(uglify()) // pressen JavaScript
        .pipe(dest('frontend/prod/scripts/')) // Laden die fertige Datei in den Zielordner hoch
        .pipe(browserSync.stream()) // Browsersync-Triggerung für Seitenaktualisierungen
}

function scriptsVendor() {
    return src( //Nehmen die Dateien aus Quellen
        'frontend/src/scripts/vendor/**/*.js')
        .pipe(concat('vendor.min.js')) // Konvertieren in einer Datei
        .pipe(uglify()) // pressen JavaScript
        .pipe(dest('frontend/prod/scripts/')) // Laden die fertige Datei in den Zielordner hoch
        .pipe(browserSync.stream()) // Browsersync-Triggerung für Seitenaktualisierungen
}

// Die Funktion styles aufbauen
function stylesHead() {
    return src( 'frontend/src/' + preprocessorFolder + '/head.' + preprocessor + '')
        .pipe(eval(preprocessor)()) // Den Wert der "Präprozessor"-Variablen in eine Funktion umwandeln
        .pipe(concat('head.min.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
        .pipe(dest('frontend/prod/css/'))
        .pipe(browserSync.stream())
}

function stylesMain() {
    return src( 'frontend/src/' + preprocessorFolder + '/main.' + preprocessor + '')
        .pipe(eval(preprocessor)()) // Den Wert der "Präprozessor"-Variablen in eine Funktion umwandeln
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
        .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
        .pipe(dest('frontend/prod/css/'))
        .pipe(browserSync.stream())
}

// Die Funktion "imagesSvg()" aufbauen
function images() {
    return src('frontend/src/images/**/*')
        .pipe(newer('frontend/prod/images/**/*'))
        .pipe(imagemin())
        .pipe(dest('frontend/prod/images/'))
}

// Die Funktion "cleanimg()" aufbauen
function cleanimg() {
    return del('frontend/prod/images/**/*', { force: true })
}

// Die Funktion 'fonts()' aufbauen:
function fonts() {
    return src('frontend/src/fonts/**/*.*')
        .pipe(dest('frontend/prod/fonts/'))
}

// Die Funktion für scripts aufbauen
function startwatch() {
    watch('frontend/src/templates/**/*.pug', pug2html);
    // Wählen alle JS-Dateien im Projekt aus und schließen die Dateien dann mit der Endung .min.js aus.
    watch(['frontend/src/scripts/components/**/*.js', 'frontend/src/scripts/components/**/*.js','!frontend/prod/scripts/**/*.min.js'], scripts);
    watch(['frontend/src/scripts/vendor/**/*.js','!frontend/prod/scripts/**/*.min.js'], scriptsVendor);
    // Überwachung von Präprozessor-Dateien auf Änderungen
    watch('frontend/src/' + preprocessorFolder + '**/*', stylesHead, stylesMain);
    // Bildüberwachung
    watch('frontend/src/images/', images);
    // Fontsüberwachung
    watch('frontend/src/fonts/', fonts);
}

// Die Funktion 'cleandist()':
function cleandist() {
    return del('frontend/prod/**/*', { force: true }) // Удаляем всё содержимое папки "dist/"
}

exports.cleandist       = cleandist;
exports.pug2html        = pug2html;
exports.browsersync     = browsersync; // Exportieren die Funktion 'browsersync()':
exports.scripts         = scripts; // Exportieren die Funktion 'scripts()':
exports.scriptsVendor   = scriptsVendor;
exports.styleshead      = stylesHead; // Exportieren die Funktion 'styles()':
exports.stylesmain      = stylesMain
exports.images          = images; // Exportieren die Funktion 'imagesSvg()':
exports.fonts           = fonts; // Exportieren die Funktion 'fonts()':
exports.cleanimg        = cleanimg; //Exportieren die Funktion 'cleanimg()':

exports.build           = series( // Exportieren gulp build
    cleandist,
    pug2html,
    stylesHead,
    stylesMain,
    scripts,
    scriptsVendor,
    images,
    fonts);

exports.watch           = parallel( // Exportieren die Funktion Default
    pug2html,
    images,
    stylesHead,
    stylesMain,
    scripts,
    scriptsVendor,
    browsersync,
    startwatch);



