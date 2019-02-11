//
//  GULPFILE.JS - Reactified
//  Author: Nikolas Ramstedt (nikolas.ramstedt@helsingborg.se)
//
//  Commands:
//  "gulp"          -   Build and watch task combined
//  "gulp build"    -   Build assets
//  "gulp watch"    -   Watch for file changes and build changed files
//

const gulp = require('gulp');
const sass = require('gulp-sass');
const terser = require('gulp-terser');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const rev = require('gulp-rev');
const revDel = require('rev-del');
const runSequence = require('run-sequence');
const sourcemaps = require('gulp-sourcemaps');
const notifier = require('node-notifier');
const del = require('del');
const eslint = require('gulp-eslint');
const streamify = require('gulp-streamify');

//Dependecies required to compile ES6 Scripts
const browserify = require('browserify');
const reactify = require('reactify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const babelify = require('babelify');
const es = require('event-stream');

//Dependecies required to compile non React script
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');

// ==========================================================================
// Default Task
// ==========================================================================

gulp.task('default', function(callback) {
    runSequence('build', 'watch', callback);
});

// ==========================================================================
// Build Tasks
// ==========================================================================

gulp.task('build', function(callback) {
    runSequence('clean:dist', ['sass', 'scripts', 'img'], 'revision', callback);
});

gulp.task('build:sass', function(callback) {
    runSequence('sass', 'revision', callback);
});

gulp.task('build:scripts', function(callback) {
    runSequence('scripts', 'revision', callback);
});

// ==========================================================================
// Watch Task
// ==========================================================================
gulp.task('watch', function() {
    gulp.watch(['source/js/**/*.js', 'source/js/**/*.jsx'], ['build:scripts']);
    gulp.watch('source/sass/**/*.scss', ['build:sass']);
    gulp.watch('source/img/**/*.*', ['build:img']);
});

// ==========================================================================
// SASS Task
// ==========================================================================
gulp.task('sass', function() {
    var filePath = 'source/sass/';
    var files = ['event-manager-integration.scss', 'event-manager-integration-admin.scss'];

    var tasks = files.map(function(entry) {
        return gulp
            .src(filePath + entry)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(
                sass().on('error', function(err) {
                    console.log(err.message);
                    notifier.notify({
                        title: 'SASS Compile Error',
                        message: err.message,
                    });
                })
            )
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist/css'))
            .pipe(cleanCSS({ debug: true }))
            .pipe(gulp.dest('dist/.tmp/css'));
    });

    return es.merge.apply(null, tasks);
});

// ==========================================================================
// Scripts Task
// ==========================================================================
gulp.task('scripts', function() {
    gulp.src(['source/js/admin/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(
            jshint.reporter('fail').on('error', function(err) {
                this.pipe(jshint.reporter('default'));
                notifier.notify({
                    title: 'JS Compile Error',
                    message: err.message,
                });
            })
        )
        .pipe(concat('event-integration-admin.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(
            uglify().on('error', function(err) {
                return;
            })
        )
        .pipe(gulp.dest('dist/.tmp/js'));

    gulp.src(['source/js/front/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(
            jshint.reporter('fail').on('error', function(err) {
                this.pipe(jshint.reporter('default'));
                notifier.notify({
                    title: 'JS Compile Error',
                    message: err.message,
                });
            })
        )
        .pipe(concat('event-integration-front.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(
            uglify().on('error', function(err) {
                return;
            })
        )
        .pipe(gulp.dest('dist/.tmp/js'));

    var filePath = 'source/js/';
    var files = ['Module/Event/Index.js'];

    var tasks = files.map(function(entry) {
        return (
            browserify({
                entries: [filePath + entry],
                debug: true,
            })
                .transform([babelify])
                .bundle()
                .on('error', function(err) {
                    console.log(err.message);

                    notifier.notify({
                        title: 'Compile Error',
                        message: err.message,
                    });

                    this.emit('end');
                })
                .pipe(source(entry)) // Converts To Vinyl Stream
                .pipe(buffer()) // Converts Vinyl Stream To Vinyl Buffer
                // Gulp Plugins Here!
                .pipe(sourcemaps.init())
                .pipe(sourcemaps.write())
                .pipe(gulp.dest('dist/js'))
                .pipe(terser())
                .pipe(gulp.dest('dist/.tmp/js'))
        );
    });

    return es.merge.apply(null, tasks);
});

// ==========================================================================
// Images
// ==========================================================================
var filePath = 'source/img/*.*';

gulp.task('img', function() {
    gulp.src(filePath).pipe(gulp.dest('dist/img'));
});

// ==========================================================================
// Revision Task
// ==========================================================================

gulp.task('revision', function() {
    return gulp
        .src(['./dist/.tmp/**/*'])
        .pipe(rev())
        .pipe(gulp.dest('./dist'))
        .pipe(rev.manifest('rev-manifest.json', { merge: true }))
        .pipe(revDel({ dest: './dist' }))
        .pipe(gulp.dest('./dist'));
});

// ==========================================================================
// Clean Task
// ==========================================================================
gulp.task('clean:dist', function() {
    return del.sync('dist');
});
