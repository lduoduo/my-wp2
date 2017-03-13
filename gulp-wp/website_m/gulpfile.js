var gulp = require('gulp');
var webpack = require('gulp-webpack');

function buildCssAndJs() {
    watch('src/page/**/!(_)*.less', function(event) {
        gulp.src('.src/page/**/!(_)*.less')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./dist'));
    });

    watch(['src/page/**/!(_)*.js'], function(event) {
        gulp.src('.src/page/**/!(_)*.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('./dist'));
    });

}

//default task
gulp.task(buildCssAndJs);

gulp.task('default', gulp.series('buildCssAndJs'));