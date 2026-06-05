/* ============================================================================
   mobile.js — progressive disclosure for the content pages on phones.
   Linked AFTER each page's own script.

   GUARD: does nothing unless the viewport is <= 768px, so on tablet/desktop the
   DOM is left identical — no nodes added, no layout change.
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
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

  // About — show the first bio paragraph, collapse the rest.
  collapse(document.querySelector('.bio-columns'), 'p', 1, 'Read more');

  // Experience / Education — show the first bullet per card, collapse the rest.
  document.querySelectorAll('.exp-bullets').forEach((ul) => collapse(ul, 'li', 1, 'Show details'));
  document.querySelectorAll('.edu-bullets').forEach((ul) => collapse(ul, 'li', 1, 'Show details'));

  // Publications — collapse each group (between two .group-subheaders) to its first 3 cards.
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
});
