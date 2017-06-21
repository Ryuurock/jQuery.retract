const gulp = require( 'gulp' );
const uglify = require( 'gulp-uglify' );
const fileRename = require( 'gulp-rename' );


gulp.task( 'build', function() {
  this.src( './src/jquery.retract.js' )
    .pipe( uglify() )
    .pipe( fileRename( {
      suffix: '.min'
    } ) )
    .pipe( this.dest( './build/' ) );
} );