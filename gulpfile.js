var gulp=require('gulp'),
    scss=require('gulp-sass'),
    browserSync=require('browser-sync'),
    rename=require('gulp-rename'),
    del=require('del'),
    autoprefixer=require('gulp-autoprefixer'),
    concat = require('gulp-concat');


// gulp.task('sass', function(){
//     return gulp.src('app/scss/style.scss')
//         .pipe(scss().on( 'error', function( error )
// 		{
// 		  console.log( error );
// 		} ))
//         .pipe(gcmq())
//         .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
//         .pipe(gulp.dest('app/css'))
//         .pipe(browserSync.reload({stream: true}))
// });

// gulp.task('libsJs', function() {
//     return gulp.src('app/libs/*.*')
//         .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
// });

gulp.task('scripts', function() {
    return gulp.src('app/scripts/*.*')
        .pipe(concat('script.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('watch', ['browser-sync',  'scripts'], function() {
    // gulp.watch('app/scss/*.scss', ['sass']);
    // gulp.watch('app/index.html');
    gulp.watch('app/scripts/*.js',['scripts']);
});

gulp.task('clean', function() {
    return del.sync('dist');
});


// gulp.task('build', ['clean', 'sass'], function() {
//     var buildCss = gulp.src(['app/css/*','app/css/*/*'])
//         .pipe(gulp.dest('dist/css'));
//     var buildHtml = gulp.src('app/*.html')
//         .pipe(gulp.dest('dist'));
//     var buildHtmlInf = gulp.src('app/article/*.html')
//         .pipe(gulp.dest('dist/article'));
//     var buildJs = gulp.src('app/js/*.js')
//         .pipe(gulp.dest('dist/js'));
//     var buildImg = gulp.src('app/images/*')
//         .pipe(gulp.dest('dist/images'));
//     var buildSvg = gulp.src('app/images/svg/*.*')
//         .pipe(gulp.dest('dist/images/svg'));
//     var buildFonts = gulp.src('app/fonts/*')
//         .pipe(gulp.dest('dist/fonts'));
// });