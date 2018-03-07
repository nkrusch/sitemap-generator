let paths = require('./config/gulp.config.json');
let semver = require('semver');
let gulp = require('gulp');
let del = require('del');
let fs = require('fs');
let webpack = require('webpack-stream');
let $ = require('gulp-load-plugins')();
let argv = require('yargs').argv;
let isProd = (argv.env === 'build');
let isBump = isProd && (argv.patch || argv.major || argv.minor);

gulp.task('default', [
    'clean',
    'copy-manifest',
    'copy-images',
    'copy-locales',
    'build-html',
    'build-css',
    'build-js',
    'watch'
]);

gulp.task('release', function () {
    let version = JSON.parse(fs.readFileSync(paths.package, 'utf8')).version;
    return gulp.src(paths.dist + '/**/*')
        .pipe($.zip(version + '.zip'))
        .pipe(gulp.dest(paths.releases + '/'));
});

gulp.task('watch', function () {
    if (!argv.watch) return;
    gulp.watch(paths.js, ['build-js']);
    gulp.watch(paths.html, ['build-html']);
    gulp.watch(paths.scss, ['build-css']);
    gulp.watch(paths.locales + '**/*.json', ['copy-locales']);
    gulp.watch(paths.manifest, ['copy-manifest']);
    gulp.watch(paths.icons, ['copy-images']);
});

gulp.task('clean', function () {
    return del.sync(paths.dist + '/*');
});

gulp.task('copy-manifest', function () {
    if (isBump) {
        let step = argv.patch ? 'patch' : (argv.major ? 'major' : 'minor');
        let manifest = JSON.parse(fs.readFileSync(paths.manifest, 'utf8'));
        let version_name = semver.inc(manifest.version, step)
        let tmp = paths.manifest.split("/"); tmp.pop();
        let manifest_dir = tmp.join("/") + "/"

        setTimeout(function () {
            gulp.src(paths.package)
                .pipe($.jsonModify({
                    key: 'version',
                    value: version_name
                }))
                .pipe(gulp.dest('./'));
        }, 10);

        return gulp.src(paths.manifest)
            .pipe($.jsonModify({
                key: 'version',
                value: version_name
            }))
            .pipe($.jsonModify({
                key: 'version_name',
                value: version_name
            }))
            .pipe(gulp.dest(manifest_dir))
            .pipe($.jsonminify())
            .pipe(gulp.dest(paths.dist));

    } else return gulp.src(paths.manifest)
        .pipe($.jsonminify())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy-images', function () {
    return gulp.src(paths.icons)
        .pipe(gulp.dest(paths.dist + "/icons"));
});

gulp.task('copy-locales', function () {
    paths.locales_list.map(function (language) {
        if (fs.existsSync(paths.locales + language)) {
            gulp.src(paths.locales + language + "/**/*.json")
                .pipe($.mergeJson({ fileName: 'messages.json' }))
                .pipe($.jsonminify())
                .pipe(gulp.dest(paths.dist + "/_locales/" + language));
        } else {
            gulp.src(paths.locales + "/en/**/*.json")
                .pipe($.mergeJson({ fileName: 'messages.json' }))
                .pipe($.jsonminify())
                .pipe(gulp.dest(paths.dist + "/_locales/" + language));
        }
    });
});

gulp.task('build-css', function () {
    return gulp.src(paths.scss)
        .pipe($.sass())
        .pipe($.if(isProd, $.cleanCss()))
        .pipe($.concat('styles.css'))
        .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('build-html', function () {
    return gulp.src(paths.html)
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe($.rename(function (path) {
            path.dirname = "";
        }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('build-js', function () {
 
    gulp.src(paths.process)
        .pipe(webpack(require(paths.webpack)))
        .pipe($.rename(function (path) {
            path.dirname = "";
            path.basename = "process"
        })).pipe(gulp.dest(paths.dist));
        
    gulp.src(paths.setup)
        .pipe(webpack(require(paths.webpack)))
        .pipe($.rename(function (path) {
            path.dirname = "";
            path.basename = "setup"
        })).pipe(gulp.dest(paths.dist));

    gulp.src(paths.background)
        .pipe(webpack(require(paths.webpack)))
        .pipe($.rename(function (path) {
            path.dirname = "";
            path.basename = "background"
        })).pipe(gulp.dest(paths.dist));

    return gulp.src(paths.content)
        .pipe(webpack(require(paths.webpack)))
        .pipe($.rename(function (path) {
            path.dirname = "";
            path.basename = "content"
        })).pipe(gulp.dest(paths.dist));
})