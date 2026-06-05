/* ============================================================================
   MOBILE PREVIEW SCRIPT — injected at render time only. Demonstrates the
   "show the headline, collapse the depth" progressive-disclosure idea.

   GUARD: it does NOTHING unless the viewport is <= 768px. So when the same
   script is injected on a desktop-width render it is a pure no-op and the
   desktop DOM is left identical — that's how we keep desktop frozen.
   ========================================================================== */
(function () {
  if (!window.matchMedia('(max-width: 768px)').matches) return; // desktop -> no-op

  // Keep the first `keep` matching children visible; tuck the rest behind a toggle.
  function collapse(parent, childSelector, keep, moreLabel) {
    if (!parent) return;
    const items = Array.from(parent.querySelectorAll(childSelector));
    if (items.length <= keep) return;
    const hidden = items.slice(keep);
    hidden.forEach((el) => el.classList.add('m-collapsed'));

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'm-toggle';
    let open = false;
    const render = () => (btn.textContent = open ? '▴ Show less' : `▾ ${moreLabel} (${hidden.length})`);
    render();
    btn.addEventListener('click', () => {
      open = !open;
      hidden.forEach((el) => el.classList.toggle('m-collapsed', !open));
      render();
    });
    parent.insertAdjacentElement('afterend', btn);
  }

  // About — show first bio paragraph, collapse the rest.
  collapse(document.querySelector('.bio-columns'), 'p', 1, 'Read more');

  // Experience / Education — show first bullet, collapse the rest of each card.
  document.querySelectorAll('.exp-bullets').forEach((ul) => collapse(ul, 'li', 1, 'Show details'));
  document.querySelectorAll('.edu-bullets').forEach((ul) => collapse(ul, 'li', 1, 'Show details'));

  // Publications — collapse each group to its first 3 cards.
  // Group = the elements between one .group-subheader and the next.
  document.querySelectorAll('.group-subheader').forEach((header) => {
    const cards = [];
    let n = header.nextElementSibling;
    while (n && !n.classList.contains('group-subheader') && !n.classList.contains('section-header')) {
      if (n.classList.contains('pub-card') || n.classList.contains('award-card')) cards.push(n);
      n = n.nextElementSibling;
    }
    if (cards.length <= 3) return;
    const hidden = cards.slice(3);
    hidden.forEach((el) => el.classList.add('m-collapsed'));
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'm-toggle';
    let open = false;
    const render = () => (btn.textContent = open ? '▴ Show less' : `▾ Show all ${cards.length}`);
    render();
    btn.addEventListener('click', () => {
      open = !open;
      hidden.forEach((el) => el.classList.toggle('m-collapsed', !open));
      render();
    });
    (cards[2] || header).insertAdjacentElement('afterend', btn);
  });
})();
