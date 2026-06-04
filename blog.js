document.addEventListener('DOMContentLoaded', () => {

  // Scroll-triggered entrance animations for blog post cards
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-section');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll('.hidden-section').forEach(sec => observer.observe(sec));

});
