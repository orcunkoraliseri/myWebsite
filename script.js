document.addEventListener('DOMContentLoaded', () => {
  const tiles = document.querySelectorAll('.tile');
  const canHoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. High-Fidelity 3D Tilt Effect (fine hover pointer + motion allowed)
  if (canHoverFine && !reduceMotion) {
    tiles.forEach((tile) => {
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

        // Short transition during cursor tracking for smooth responsiveness
        tile.style.transition =
          'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.03)`;
      });

      tile.addEventListener('mouseleave', () => {
        tile.style.transition = '';
        tile.style.transform = '';
      });
    });
  }

  // 2. Tap-to-Reveal mechanics for Touch interactions (keeps touch laptops working on mouse/keyboard)
  let lastPointerType = window.matchMedia('(hover: none)').matches ? 'touch' : 'mouse';

  tiles.forEach((tile) => {
    tile.addEventListener('pointerdown', (e) => {
      lastPointerType = e.pointerType || 'mouse';
    });

    tile.addEventListener('click', (e) => {
      if (e.detail === 0) return; // Keyboard Enter should navigate immediately
      const isTouchTap = lastPointerType === 'touch' || window.matchMedia('(hover: none)').matches;
      if (!isTouchTap) return;

      if (!tile.classList.contains('active-reveal')) {
        e.preventDefault();
        tiles.forEach((t) => t.classList.remove('active-reveal'));
        tile.classList.add('active-reveal');
      }
    });
  });

  // Close reveal if tapping outside the tiles
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' && !e.target.closest('.tile')) {
      tiles.forEach((t) => t.classList.remove('active-reveal'));
    }
  });
});
