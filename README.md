#Frontend Guidelines

1. **Ordner aufbauen**

    Die Struktur:
    
        | rshdbairamov_frontend
            | frontend
                | prod
                | src
                    | Fonts
                    | Images
                    | Sass
                    | Scripts
                    | Templates
                        | Layouts
                        | Mixins
                        | Partials

2. **NPM initialisieren**

    im Ordner rshdbairamov und frontend npm initialisieren:
    <pre> $: npm init </pre>
    
3. _Gulp installieren_

    im Terminal:
    <pre>npm i gulp --save-dev</pre>
    
4. _Gulpfile.js aufbauen_
    
    4.1 Constants definieren:
        <pre>const { src, dest, parallel, series, watch } = require('gulp');</pre>
5. _Live Server installieren_
    
    <pre>npm i browser-sync --save-dev</pre>
    
    5.1 Browsersync in der Gulp-Datei anschalten
        
    <pre>const browserSync = require('browser-sync').create();</pre>
        
    Man muss ".create()" angeben um eine neue Verbindung zu erstellen
            
    5.2 "Browsersync-Logik" beschreiben
        
    <pre>
        function browsersync() {
            browserSync.init({ //Initialization Browsersync
                server: {baseDir: 'frontend/prod'}, // Definieren Server-Ordner
                notify: false, // Die Anzeigen ausschalten
                online: true, // Betriebsmodus true oder false
            })
        }
    </pre>
    
    5.3 Exportieren die Funktion browsersync()
    
    <pre>exports.browsersync = browsersync;</pre>
    
6. _Arbeit mit Scripts._
    
    6.1 Jquery, Concat und Uglify installieren:
    <pre>
        npm i jquery --save-dev
        npm i gulp-concat gulp-uglify-es --save-dev
    </pre>
    
    6.2 Concat und Uglify als constants definieren:
    
    <pre>
        const concat = require('gulp-concat');
        const uglify = require('gulp-uglify-es').default;
    </pre>  
    
    6.2 Die Funktion 'scripts' aufbauen:
    
    <pre>
        function scripts() {
            return src([ //Nehmen die Dateien aus Quellen
                'frontend/node_modules/jquery/dist/jquery.min.js',
                'frontend/src/Scripts/**/*.js',
            ])
                .pipe(concat('scripts.min.js')) // Konvertieren in einer Datei
                .pipe(uglify()) // pressen JavaScript
                .pipe(dest('frontend/prod/scripts/')) // Laden die fertige Datei in den Zielordner hoch
                .pipe(browserSync.stream()) // Browsersync-Triggerung für Seitenaktualisierungen
        } </pre>
        
    6.3 Exportieren die Funktion scripts():
    
    <pre>exports.scripts = scripts;</pre>
    
7. _Automatische Seitenaktualisierung._

    7.1 Die Funktion "startwatch()" aufbauen:
    
    <pre>function startwatch() {
             // Wählen alle JS-Dateien im Projekt aus und schließen die Dateien dann mit der Endung .min.js aus.
             watch(['frontend/src/Scripts/**/*.js', '!frontend/prod/Scripts/**/*.min.js'], scripts)
         }</pre>
         
    7.2 Exportieren die Funktion startwatch()
    
    <pre>// Exportieren die Funktion startwatch()
         exports.default = parallel(scripts, browsersync, startwatch);</pre>
         
8. _Arbeit mit Styles_
    
    8.1 Installieren «gulp-sass», «gulp-less», «gulp-autoprefixer» und «gulp-clean-css»
    
    <pre>npm i --save-dev gulp-sass gulp-less gulp-autoprefixer gulp-clean-css</pre>
    
    8.2 «gulp-sass», «gulp-less», «gulp-autoprefixer» und «gulp-clean-css» anschalten
    
    <pre>
    // gulp-sass und gulp-less anschalten
    const sass = require('gulp-sass');
    const less = require('gulp-less');
    
    // autoprefixer anschalten
    const autoprefixer = require('gulp-autoprefixer');
     
    // gulp-clean-css anschalten
    const cleancss = require('gulp-clean-css');</pre>
    
    8.3 Definieren variables 'preprocessor':
    
    <pre>let preprocessor = 'sass';</pre>
    
    8.3 Die Funktion 'styles()' aufbauen:
    
    <pre>function styles() {
             return src([
                 'frontend/src/' + preprocessor + '/main.' + preprocessor + '',
                 'frontend/src/' + preprocessor + '/head.' + preprocessor + '',
             ])
                 .pipe(eval(preprocessor)()) // Den Wert der "Präprozessor"-Variablen in eine Funktion umwandeln
                 .pipe(concat('styles.min.css'))
                 .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
                 .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } ))
                 .pipe(dest('frontend/prod/css/'))
                 .pipe(browserSync.stream())
         }</pre>
    
    8.4 Exportieren die Funktion styles()
    
    <pre>exports.styles = styles;</pre>
    
    8.5 Überwachung von Präprozessor-Dateien auf Änderungen
    
    <pre>watch('frontend/src/' + preprocessor + '**/*', styles);</pre>
    
    8.6 Exportieren die Funktion startwatch()
    
    <pre>exports.default = parallel(styles, scripts, browsersync, startwatch);</pre>
    
9. _Die Arbeit mit deт Bilder_
    
    9.1 Die Ordner vorbereiten.
    
    9.2 Installieren Modules gulp-imagemin gulp-newer;
    
    <pre>npm i --save-dev gulp-imagemin gulp-newer </pre> 
    
    9.3 Anschalten die Module
    
    <pre>
    // Anschalten gulp-imagemin für die Arbeit mit den Bilder
    const imagemin = require('gulp-imagemin');
     
    // Anschalten gulp-newer
    const newer = require('gulp-newer');
     
    // Anschalten del
    const del = require('del');</pre>
    
    9.4 Die Funktion 'images()' aufbauen
    
    <pre>
    function images() {
        return src('frontend/src/images/**/*')
            .pipe(newer('frontend/prod/images/'))
            .pipe(imagemin())
            .pipe(dest('frontend/prod/images/'))
    }</pre>
    
    9.5 Exportieren die Funktion 'images()':
    
    <pre>exports.images = images;</pre>
    
    9.6 Bildüberwachung:
    <pre>watch('frontend/src/images/**/*', images);</pre>
    
    
10. _Die Bilder Löschen_

    10.1 Die Funktion 'cleanimg()' definieren:
    <pre>function cleanimg() {
             return del('frontend/prod/images/**/*', { force: true })
         }</pre>
    
    10.2 Exportieren die Funktion 'cleanimg()':
    <pre>exports.cleanimg = cleanimg;</pre>
    
11. _Die Pug bearbeiten_
    
    11.1 Module 'gulp-w3c-html-validator', 'gulp-plumber', 'gulp-pug', 'yargs', 'gulp-if', 'gulp-html-beautify' installieren.
    
    11.2 Constants definieren:
    <pre>
    const htmlValidator = require('gulp-w3c-html-validator');
    const plumber       = require('gulp-plumber');
    const pug           = require('gulp-pug');
    const argv          = require('yargs').argv;
    const gulpif        = require('gulp-if');
    const htmlbeautify  = require('gulp-html-beautify');</pre>
    
    11.3 Die Funktion 'pug2html()' schreiben:
    
    <pre>
    function pug2html() {
        return src('frontend/src/templates/*.pug')
            .pipe(plumber())
            .pipe(pug())
            .pipe(plumber.stop())
            .pipe(gulpif(argv.prod, htmlValidator()))
            .pipe(htmlbeautify())
            .pipe(dest('frontend/prod'))
    }
    </pre>
    
    11.4 Die Funktion 'pug2html()' exportieren:
    <pre>exports.pug2html    = pug2html;</pre>
    
 
    
    
    