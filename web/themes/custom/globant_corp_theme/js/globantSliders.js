(function ($, Drupal) {
  Drupal.behaviors.sliders = {
    attach: function (context, settings) {
      $('div.paragraph-home-slider', context).once('paragraph-home-slider').each(function () {
        $('div.paragraph-home-slider').slick({autoplay: true, autoplaySpeed: 2000, fade: true,dots: false,
    prevArrow: false,
    nextArrow: false});
      });
    }
  };
})(jQuery, Drupal);
