document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Scroll-triggered entrance animations for sections
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


  // 2. Staggered fade-in for the photo mosaic images
  const mosaicImages = document.querySelectorAll('.mosaic-img');
  mosaicImages.forEach((img, index) => {
    // Add a slight delay for each image to create a cascade effect
    setTimeout(() => {
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 150 + (index * 60)); // Starts after 150ms, then 60ms between each
  });
});
