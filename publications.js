document.addEventListener('DOMContentLoaded', () => {
  const hiddenSections = document.querySelectorAll('.hidden-section');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hiddenSections.forEach((sec) => sec.classList.add('show-section'));
    return;
  }

  // Scroll-triggered entrance animations for award & publication cards
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
});
