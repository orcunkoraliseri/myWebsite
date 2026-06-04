document.addEventListener('DOMContentLoaded', () => {

  // Scroll-triggered entrance animations for award & publication cards
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-section');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const hiddenSections = document.querySelectorAll('.hidden-section');
  hiddenSections.forEach(sec => observer.observe(sec));

});
