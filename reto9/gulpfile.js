var gulp = require('gulp'),
  sass = require('gulp-sass'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  gulpIf = require('gulp-if'),
  useref = require('gulp-useref'),
  cache = require('gulp-cache');

var distfolder = '',
  appfolder = '';

var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('scss', function () {
  console.log("Generando css desde scss");
  return gulp
    .src(appfolder+'scss/*.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(gulp.dest(distfolder+'css'));
});

gulp.task('watch', function() {
  gulp.watch(appfolder+'scss/*.scss', ['sass']);
  /*gulp.watch(appfolder+'/*.+(htm|html)', ['htmldist']);
  gulp.watch(appfolder+'/js/*.js', ['jsdist']);
  gulp.watch(appfolder+'/css/*.css', ['cssdist']);
  gulp.watch(appfolder+'/img/*.+(png|jpg|jpeg|gif|svg|bmp)', ['imgdist']);*/
});

gulp.task('htmldist',function() {
  console.log("Copiando html a dist");
  return gulp
    .src(appfolder+'/*.+(html|htm)')
    .pipe(gulp.dest(distfolder+''));
});

gulp.task('jsdist',function() {
  console.log("Copiando js a dist");
  return gulp
    .src(['!'+appfolder+'/js/*.test.js', appfolder+'/js/*.js'])
    .pipe(gulp.dest(distfolder+'/js'));
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(distfolder))
});

gulp.task('cssdist',function() {
  console.log("Copiando css a dist");
  return gulp
    .src(appfolder+'/css/*.css')
    .pipe(gulp.dest(distfolder+'/css'));
});

gulp.task('imgdist',function() {
  console.log("Copiando img a dist");
  return gulp
    .src(appfolder+'/img/*.+(png|jpg|jpeg|gif|svg|bmp)')
    .pipe(gulp.dest(distfolder+'/images'));
});

gulp.task('images', function(){
  return gulp
    .src(appfolder+'/images/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest(distfolder+'/images'))
});

gulp.task('fonts', function() {
  return gulp
    .src(appfolder+'/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync(distfolder);
});

gulp.task('default',['scss','htmldist','cssdist','jsdist','images','fonts']);
