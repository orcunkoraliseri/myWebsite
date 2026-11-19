document.addEventListener('DOMContentLoaded', () => {
  const hiddenSections = document.querySelectorAll('.hidden-section');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hiddenSections.forEach((sec) => sec.classList.add('show-section'));
    return;
  }

  // Scroll-triggered entrance animations, staggered left -> right
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const index = Array.from(card.parentNode.children).indexOf(card);
          card.style.transitionDelay = `${index * 0.08}s`;
          card.classList.add('show-section');
          setTimeout(() => {
            card.style.transitionDelay = '';
          }, index * 80 + 750);
          obs.unobserve(card);
        }
      });
    },
    { root: null, rootMargin: '0px 0px 40px 0px', threshold: 0.05 }
  );

  hiddenSections.forEach((sec) => observer.observe(sec));
});
