var gulp = require('gulp'),
scss = require('gulp-sass'),
watch = require('gulp-watch'),
browserSync = require('browser-sync'),
reload = browserSync.reload,
del = require('del'),
cleanCSS = require('gulp-clean-css'),
imagemin = require('gulp-imagemin'),
pngquant = require('imagemin-pngquant'),
imageminJpegRecompress = require('imagemin-jpeg-recompress'),
concat = require('gulp-concat'),
compass = require('compass-importer'),
order = require('gulp-order'),
spritesmith = require('gulp.spritesmith'),
uglify = require('gulp-uglifyjs'),
cache = require('gulp-cache'),
twig = require('gulp-twig'),
webpack  = require('webpack-stream');

gulp.task('scss', function() {
	return gulp.src([
		'app/fonts/**/*.css',
		'libs/mixins/**/*.+(scss|css)',
		'libs/other-libs/**/*.+(scss|css)',
		'app/blocks/base.blocks/**/*.+(scss|css)',
		'app/blocks/common.blocks/**/*.+(scss|css)',
		'app/blocks/site.blocks/**/*.+(scss|css)'
		])
	.pipe(order([
		'libs/mixins/**/*.+(scss|css)',
		'app/fonts/**/*.css',
		'app/blocks/base.blocks/base/base.scss',


		'libs/other-libs/**/*.+(scss|css)',

		'app/blocks/common.blocks/**/*.+(scss|css)',
		'app/blocks/site.blocks/**/*.+(scss|css)'],{base: './'}))
	.pipe(concat('style.scss'))
	.pipe(scss({importer: compass, includePaths:['libs/mixins']}))
/*	.pipe(cleanCSS({
		keepSpecialComments :0,
		rebase: false

	}))*/
	.pipe(gulp.dest('dist/css'));
	//.pipe(reload({stream: true}));
	//.pipe(browserSync.reload({stream: true}));
});


gulp.task('sprite', function() {
	var spriteData =
        gulp.src('app/img/sprites/*') // путь, откуда берем картинки для спрайта
        .pipe(cache(imagemin([
        	pngquant()
        	],
        	{
        		verbose:true
        	}
        	)))
        .pipe(spritesmith({
        	imgName: 'sprite.png',
        	cssName: 'sprite.scss',
        	imgPath:'../img/sprite.png',
        	cssFormat: "scss"
        }));

    spriteData.img.pipe(gulp.dest('dist/img/')); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('libs/mixins')); // путь, куда сохраняем стили
});

gulp.task('js', function() {
	return gulp.src([
		'libs/other-libs/**/*.js',
		'app/blocks/base.blocks/**/*.js',
		'app/blocks/common.blocks/**/*.js',
		'app/blocks/site.blocks/**/*.js'
		])
	.pipe(concat('main.js'))
	.on('error', function handleError() {
		this.emit('end'); 
	})
/*	.pipe(uglify({
		comments: false
	}))*/
	.pipe(gulp.dest('dist/js'));
});

//gulp.task('html', function() {
//	return gulp.src('app/html/**/*.html')
//	.pipe(gulp.dest('dist'))
//	.pipe(reload({stream: true}));

//});

gulp.task('twig', function () {
	return gulp.src('app/blocks/site.blocks/**/*page.twig')
	.pipe(twig({
		base: 'app'
	}))
	.pipe(gulp.dest('dist/pages'));
});

/*gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});*/

gulp.task('fonts',function(){
	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));
});



gulp.task('watch', [/*'clean',*/ 'img', 'sprite', 'fonts', 'scss','js','twig'],function(){

	watch('app/blocks/**/*.+(scss|css)', function(event,cb){
		gulp.start('scss');
	});

	watch('app/blocks/**/*.js', function(event,cb){
		gulp.start('js');
	});


	watch('app/blocks/**/*.twig', function(event,cb){
		gulp.start('twig');
	});

	watch('app/img/**/*', function(event,cb){
		gulp.start('img');
		gulp.start('sprite');
	});

	watch('app/fonts/**/*', function(event,cb){
		gulp.start('fonts');
		gulp.start('scss');
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src(['app/img/**/*',"!app/img/{sprites,sprites/**}"]) // Берем все изображения из app
    .pipe(cache(imagemin([
    	imageminJpegRecompress({
    		loops:4,
    		min: 50,
    		max: 95,
    		quality:'high'
    	}),
    	pngquant()
    	],
    	{
    		verbose: true
    	}
    	)))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['watch']);

