var path = require('path');

var gulp = require('gulp');
var jade = require('gulp-jade');
var less = require('gulp-less');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('templates', ['javascript', 'less'], function() {
  return gulp.src(['src/templates/**/*.jade', '!src/templates/layout.jade'])
    .pipe(jade({
      locals: {}
    }))
    .pipe(gulp.dest('public/'));
});

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

gulp.task('static', function() {
  return gulp.src('src/static/**/*')
    .pipe(gulp.dest('public'));
});

gulp.task('watch', ['web'], function () {
    gulp.watch('src/templates/**/*', ['web']);
    gulp.watch('src/less/**/*', ['web']);
    gulp.watch('src/javascript/**/*', ['web']);
    gulp.watch('src/static/**/*', ['web']);
});

gulp.task('build', ['web']);
gulp.task('web', ['javascript', 'less', 'templates', 'static']);
gulp.task('default', ['build']);

