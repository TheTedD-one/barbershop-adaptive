"use strict";

const gulp = require("gulp");
const plumber = require("gulp-plumber");
const del = require("del");
const less = require("gulp-less");
const notify = require("gulp-notify");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync");
const svgmin = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");
const postcss = require("gulp-postcss");
const mqpacker = require("css-mqpacker");
const concat = require("gulp-concat");

const path = {
  dist: {
    html: "dist/",
    css: "dist/css/",
    img: "dist/img/",
    svg: "temp/sprite.svg",
    fonts: "dist/fonts",
    vendorCss: "dist/css/"
  },
  src: {
    html: "src/pages/*.html",
    style: "src/style/main.less",
    img: "src/img/*.*",
    svg: "src/img/sprite/svg/*.svg",
    fonts: "src/fonts/**/*.*",
    vendorCss: "bower_components/**/*.css"
  },
  watch: {
    html: "src/pages/**/*.html",
    style: "src/style/**/*.less",
    img: "src/img/*.*",
    svg: "src/img/sprite/svg/*.svg",
    fonts: "src/fonts/**/*.*",
    vendorCss: "bower_components/**/*.css"
  }
};

gulp.task("clean", function() {
  return del("dist");
});

gulp.task("html:build", function() {
  return gulp.src(path.src.html)
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: "html",
          message: err.message
        };
      })
    }))
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
    .pipe(less())
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 10 versions'],
        cascade: false
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(rename("style.css"))
    .pipe(gulp.dest(path.dist.css))
    .pipe(csso())
    .pipe(rename("style.min.css"))
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

gulp.task("svg:build", function() {
  return gulp.src(path.src.svg)
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: "svg",
          message: err.message
        };
      })
    }))
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(path.dist.svg))
});

gulp.task("fonts:build", function() {
  return gulp.src(path.src.fonts)
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: "fonts",
          message: err.message
        };
      })
    }))
    .pipe(gulp.dest(path.dist.fonts));
});

gulp.task("vendorCss:build", function() {
  return gulp.src(path.src.vendorCss)
    .pipe(plumber({
      errorHandler: notify.onError(function(err) {
        return {
          title: "vendorCss",
          message: err.message
        };
      })
    }))
    .pipe(concat("vendors.css"))
    .pipe(csso())
    .pipe(gulp.dest(path.dist.vendorCss));
});


gulp.task("build", gulp.series(
  "clean",
  gulp.parallel(
    "html:build",
    "style:build",
    "img:build",
    "svg:build",
    "fonts:build",
    "vendorCss:build"
  )
));

gulp.task("watch", function() {
  gulp.watch(path.watch.html, gulp.series("html:build"));
  gulp.watch(path.watch.style, gulp.series("style:build"));
  gulp.watch(path.watch.img, gulp.series("img:build"));
  gulp.watch(path.watch.svg, gulp.series("svg:build"));
  gulp.watch(path.watch.fonts, gulp.series("fonts:build"));
  gulp.watch(path.watch.vendorCss, gulp.series("vendorCss:build"));
});

gulp.task("serve", function() {
  browserSync.init({
    server: "./dist"
  });

  browserSync.watch("dist/**/*.*").on("change", browserSync.reload);
});

gulp.task("start", gulp.series("build", gulp.parallel("watch", "serve")));
