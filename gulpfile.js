"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const del = require("del");
const stylus = require("gulp-stylus");
const notify = require("gulp-notify");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync");

const path = {
  dist: {
    html: "dist/",
    css: "dist/css/",
    img: "dist/img/",
    fonts: "dist/fonts"
  },
  src: {
    html: "src/pages/*.html",
    style: "src/style/main.styl",
    img: "src/img/*.{png,jpg,gif}",
    fonts: "src/fonts/**/*.*"
  },
  watch: {
    html: "src/pages/**/*.html",
    style: "src/style/**/*.styl",
    img: "src/img/*.{png,jpg,gif}",
    fonts: "src/fonts/**/*.*"
  }
};

gulp.task("clean", function() {
  return del("dist");
});

gulp.task("html:build", function() {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.dist.html));
});

gulp.task("style:build", function() {
  return gulp.src(path.src.style)
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: "style",
          message: err.message
        };
      })
    }))
    .pipe(stylus())
    .pipe(autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
      }))
    .pipe(csso())
    .pipe(rename(function(path) {
      path.basename = "style.min";
    }))
    .pipe(gulp.dest(path.dist.css));
});

gulp.task("img:build", function() {
  return gulp.src(path.src.img)
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: "image",
          message: err.message
        };
      })
    }))
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest(path.dist.img));
});

gulp.task("fonts:build", function() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});



gulp.task("build", gulp.series(
  "clean",
  gulp.parallel(
    "html:build",
    "style:build",
    "img:build",
    "fonts:build"
  )
));

gulp.task("watch", function() {
  gulp.watch(path.watch.html, gulp.series("html:build"));
  gulp.watch(path.watch.style, gulp.series("style:build"));
  gulp.watch(path.watch.img, gulp.series("img:build"));
  gulp.watch(path.watch.fonts, gulp.series("fonts:build"));
});

gulp.task("serve", function() {
  browserSync.init({
    server: "./dist"
  });

  browserSync.watch("dist/**/*.*").on("change", browserSync.reload);
});

gulp.task("start", gulp.series("build", gulp.parallel("watch", "serve")));
