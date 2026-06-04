document.addEventListener('DOMContentLoaded', () => {

  // Scroll-triggered entrance animations, staggered left → right
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const index = Array.from(card.parentNode.children).indexOf(card);
        card.style.transitionDelay = `${index * 0.08}s`;
        card.classList.add('show-section');
        observer.unobserve(card); // Only animate once
      }
    });
  }, observerOptions);

  const hiddenSections = document.querySelectorAll('.hidden-section');
  hiddenSections.forEach(sec => observer.observe(sec));

});
