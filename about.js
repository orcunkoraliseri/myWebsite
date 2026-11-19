document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hiddenSections = document.querySelectorAll('.hidden-section');
  const mosaicImages = document.querySelectorAll('.mosaic-img');

  if (reduceMotion) {
    hiddenSections.forEach((sec) => sec.classList.add('show-section'));
    mosaicImages.forEach((img) => img.classList.add('is-visible'));
    return;
  }

  // 1. Scroll-triggered entrance animations for sections
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show-section');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px 40px 0px', threshold: 0.05 }
  );

  hiddenSections.forEach((sec) => observer.observe(sec));

  // 2. Staggered fade-in for the photo mosaic images (CSS class preserves :hover transform)
  mosaicImages.forEach((img, index) => {
    setTimeout(() => {
      img.classList.add('is-visible');
    }, 150 + index * 60);
  });
});
