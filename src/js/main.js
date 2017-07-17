"use strict";

$(document).ready(function() {
  let nav = $(".main-navigation");
  let navToggle = $(".main-navigation__toggle");

  nav.addClass("main-navigation--closed");
  initOwlForAdvantages();
  initOwlForFeedback();

  navToggle.on("click", function() {
    if(nav.hasClass("main-navigation--closed")) {
      nav.addClass("main-navigation--opened").removeClass("main-navigation--closed");
    }else if(nav.hasClass("main-navigation--opened")) {
      nav.addClass("main-navigation--closed").removeClass("main-navigation--opened");
    }
  });

  $(window).resize(function() {
    initOwlForAdvantages();
  });

  $(".feedback__next").on("click", function() {
    let owl = $(".feedback__content");
    owl.trigger("next.owl.carousel");
  });

  $(".feedback__prev").on("click", function() {
    let owl = $(".feedback__content");
    owl.trigger("prev.owl.carousel");
  });
});

function initOwlForFeedback() {
  let owl = $(".feedback__content");
  let owlLoaded = owl.hasClass("owl-loaded");

  owl.owlCarousel({
    loop: true,
    items: 1,
    autoplay: true,
    autoplayTimeout: 3000
  });
};

function initOwlForAdvantages() {
  let owl = $(".advantages__list");
  let owlLoaded = owl.hasClass("owl-loaded");
  let mobileWidth = window.matchMedia('(max-width: 767px)').matches;

  if(mobileWidth && !owlLoaded) {
    owl.owlCarousel({
      loop: true,
      autoplay: true,
      autoplayTimeout: 3000,
      items: 1
    });
  }

  if(!mobileWidth && owlLoaded) {
    owl.trigger("destroy.owl.carousel");
  }
};
