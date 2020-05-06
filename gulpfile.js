
var execSync = require('child_process').execSync;
var path = require('path');

var gulp = require('gulp');
var jade = require('gulp-pug');
var less = require('gulp-less');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var markdown = require('jstransformer-markdown');

gulp.task('less', function () {
  return gulp.src('src/less/style.less')
    .pipe(less({
      paths: [
        path.join(__dirname, 'vendor'),
      ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
    }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('javascript', function() {
  return gulp.src('src/javascript/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('public/js'));
});

gulp.task('templates', gulp.series(gulp.parallel('javascript', 'less'), function() {
  return gulp.src(['src/templates/**/*.jade', '!src/templates/layout.jade'])
    .pipe(jade({
      locals: {}
    }))
    .pipe(gulp.dest('public/'));
}));

gulp.task('static', function() {
  return gulp.src('src/static/**/*')
    .pipe(gulp.dest('public'));
});

gulp.task('web', gulp.parallel('javascript', 'less', 'templates', 'static'));

gulp.task('xml', function(cb) {
  switch (process.platform) {
    case 'win32':
      execSync('.\\src\\findxml.bat');
      execSync('.\\src\\xml2json.py');
      execSync('.\\src\\json2public.py');
      break;

    default:
      execSync('./src/findxml');
      execSync('./src/xml2json.py');
      execSync('./src/json2public.py');
      break;
  }

  cb();
});

gulp.task('clean', function() {
  return del([
    'public/**',
    'xml/source/**',
    'xml/json/**',
  ]);
});

gulp.task('build', gulp.parallel('xml', 'web'));

gulp.task('watch', gulp.series('web', function () {
  gulp.watch('src/templates/**/*', gulp.series('web'));
  gulp.watch('src/less/**/*', gulp.series('web'));
  gulp.watch('src/javascript/**/*', gulp.series('web'));
  gulp.watch('src/static/**/*', gulp.series('web'));
}));
