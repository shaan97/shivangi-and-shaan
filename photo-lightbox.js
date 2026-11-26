import PhotoSwipeLightbox from './assets/vendor/photoswipe-5.4.4/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from './assets/vendor/photoswipe-5.4.4/photoswipe.esm.min.js';

const gallery = document.querySelector('#cc-engagement .cc-engagement-strip');
const lightbox = new PhotoSwipeLightbox({
  gallery,
  children: '[data-engagement-photo]',
  pswpModule: PhotoSwipe,
  bgOpacity: 0.97,
  counter: false,
  imageClickAction: 'zoom',
  doubleTapAction: 'zoom',
  padding: { top: 60, right: 8, bottom: 12, left: 8 },
  closeTitle: 'Close photo',
  zoomTitle: 'Toggle photo zoom'
});

lightbox.on('afterInit', () => {
  lightbox.pswp.element.setAttribute('aria-label', 'Engagement photos');
});
lightbox.init();
gallery.querySelectorAll('[data-engagement-photo]').forEach(link => {
  link.setAttribute('aria-haspopup', 'dialog');
});
