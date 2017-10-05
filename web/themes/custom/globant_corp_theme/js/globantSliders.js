(function ($, Drupal) {
  Drupal.behaviors.sliders = {
    attach: function (context, settings) {
      $('div.paragraph-text-slider', context).once('paragraph-text-slider').each(function () {
        $('div.paragraph-text-slider').slick({autoplay: true, autoplaySpeed: 2000, fade: true,dots: false,
    prevArrow: false,
    nextArrow: false});
      });
    }
  };
})(jQuery, Drupal);
