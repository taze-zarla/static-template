import {watch, series, task, src, dest} from 'gulp';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import inlineSource from 'gulp-inline-source-html';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import del from 'del';

const server = browserSync.create();

const clean = () => {
  return del(['dist', 'tmp']);
};

const reload = (done) => {
  server.reload();
  done();
};

const serve = (done) => {
  server.init({
    server: {
      baseDir: './',
    },
  });
  done();
};

const scripts = () => {
  return src('./scripts/index.js', {sourcemaps: true})
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('index.min.js'))
    .pipe(dest('./tmp'));
};

const cssify = () => {
  return src('stylesheets/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./tmp'));
};

task(cssify);

const inlineProcess = () => {
  return src('./*.html')
    .pipe(inlineSource({compress: true}))
    .pipe(dest('dist'));
};

const copy = () => {
  return src(['./robots.txt', './favicon.ico', './assets/**/*'], {
    base: './',
  }).pipe(dest('dist'));
};

task('build', series(clean, cssify, scripts, inlineProcess, copy));

const observe = () => {
  watch('./**/*.scss', series(cssify));
  watch(['./**/*'], series(reload));
};

const dev = series(clean, cssify, scripts, serve, observe);

export default dev;
