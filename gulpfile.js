var gulp = require('gulp');
// var portal = require('portal-main');
var changed = require('gulp-changed');
// var rename = require('gulp-rename');
var merge = require('merge2');
let browserSync = require('browser-sync').create();

// var eslint = require('gulp-eslint');
const autoprefixer = require('gulp-autoprefixer');
// var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');

// var less = require('gulp-less');
var csslint = require('gulp-csslint');
var cleanCSS = require('gulp-clean-css');
// var path = require('path');

var sass = require('gulp-sass');

// let jsSource = '../src/js/*.js';

// gulp.task('js', function () {
// 	return gulp.src(jsSource)
// 		.pipe(changed('../js'))
// 		.pipe(eslint())
// 		.pipe(eslint.format())
// 		// .pipe(eslint.failAfterError())
// 		.pipe(babel())
// 		.pipe(gulp.dest('../js'))
// 		.pipe(browserSync.reload({stream: true}))
// 		.pipe(uglify())
// 		.pipe(gulp.dest('../dist/js'));
// });

let sTSSource = ['src/js/**/*.ts', 'src/js/**/*.tsx', '!src/js/**/*.d.ts'];
var tsProject = ts.createProject('src/js/tsconfig.json');

gulp.task('ts', function () {
	let tsResult = gulp.src(sTSSource)
		.pipe(changed('js', {extension: '.js'}))
		.pipe(tsProject());
	
	return merge([
		tsResult.js.pipe(gulp.dest('js'))
			.pipe(browserSync.reload({stream: true}))
			.pipe(uglify({
				compress: {
					drop_console: true
				}
			}))
			.pipe(gulp.dest('dist/js')),
		// tsResult.dts.pipe(gulp.dest('src/js'))
		tsResult.dts.pipe(gulp.dest('js/definition'))
	]);
});

let sassSource = 'src/css/*.sass';

gulp.task('sass', function () {
	return gulp.src(sassSource)
		// .pipe(changed('css', {extension: '.css'}))
		.pipe(sass().on('error', sass.logError))
		.pipe(csslint({
			lookup: false,
			ids: false,
			shorthand: true,
			'order-alphabetical': false,
			'qualified-headings': false,
			'box-model': false,
			'adjoining-classes': false,
			'important': false,
		}))
		.pipe(csslint.formatter())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
			// cascade: false
		}))		
		.pipe(gulp.dest('css'))
		.pipe(browserSync.reload({stream: true}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));
});

// gulp.task('production', () => {
	// let sServerDir = 'd:/temp/edr';
	// let sServerDir = '//dell2/e$/Execute/edr';
	// portal.copyFiles2Production('../dist/**/*', sServerDir);
	// portal.copyFiles2Production(['../**/*.php', '!../internet/**/*.php'], sServerDir);
	// portal.copyFiles2Production(['../**/*.php', '../dist/**/*.*'], sServerDir);
// });

gulp.task('default', ['ts', 'sass'], () => {
	browserSync.init({
		// server: {
		// 	files: ['./*.css', './*.js', './*.php']
		// 	// serveStatic: ['.', './app/css']			
		// },
		// proxy: 'http://localhost/Execute/edr/' // work
		proxy: 'http://localhost:8080/stater/' // home
		// serveStatic: ['./*.css', './*.js', './*.php']
	});

	// gulp.watch(jsSource, ['js'])
	// 	.on('change', portal.onFilesChange);
	gulp.watch(sTSSource, ['ts']);
		// .on('change', portal.onFilesChange);
	gulp.watch(sassSource, ['sass']);
		// .on('change', portal.onFilesChange);

	gulp.watch('./index.php').on('change', browserSync.reload);
});
