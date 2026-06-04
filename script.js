document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Trigger entrance staggered load animations
  // A small delay ensures the browser has painted the initial state before animating
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  const tiles = document.querySelectorAll('.tile');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 2. High-Fidelity 3D Tilt Effect (Desktop only)
  if (!isTouchDevice) {
    tiles.forEach(tile => {
      tile.addEventListener('mousemove', (e) => {
        const rect = tile.getBoundingClientRect();
        
        // Cursor position relative to the tile
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt angles (maximum 6 degrees tilt)
        const rotateX = ((centerY - y) / centerY) * 6;
        const rotateY = ((x - centerX) / centerX) * 6;
        
        // Temporarily disable transition during mouse movements for absolute tracking responsiveness
        tile.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        
        // Apply 3D transform combining translate, scale, and rotate
        tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.03)`;
      });
      
      tile.addEventListener('mouseleave', () => {
        // Reset styles and let CSS transition animate it smoothly back
        tile.style.transition = '';
        tile.style.transform = '';
      });
    });
  }

  // 3. Tap-to-Reveal mechanics for Touch Devices
  if (isTouchDevice) {
    // Add custom helper CSS style dynamically to support active tap reveals
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
      .tile.active-reveal .tile__label {
        opacity: 1 !important;
        transform: translateY(0) scale(1) !important;
      }
      .tile.active-reveal {
        transform: translateY(-4px) scale(1.01) !important;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05) !important;
      }
    `;
    document.head.appendChild(styleSheet);

    tiles.forEach(tile => {
      tile.addEventListener('click', (e) => {
        // If the tile is not already revealed, reveal it and prevent immediate navigation
        if (!tile.classList.contains('active-reveal')) {
          e.preventDefault();
          
          // Clear active reveal from all other tiles
          tiles.forEach(t => t.classList.remove('active-reveal'));
          
          // Set this tile to revealed
          tile.classList.add('active-reveal');
        }
      });
    });

    // Close reveal if tapping outside the tiles
    document.addEventListener('touchstart', (e) => {
      if (!e.target.closest('.tile')) {
        tiles.forEach(t => t.classList.remove('active-reveal'));
      }
    });
  }
});
