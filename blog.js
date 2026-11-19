document.addEventListener('DOMContentLoaded', () => {
  const hiddenSections = document.querySelectorAll('.hidden-section');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    hiddenSections.forEach((sec) => sec.classList.add('show-section'));
  } else {
    // ---- Scroll-triggered entrance animations for blog post cards ----
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
  }

  // ---- Search + year filter ----
  const search = document.getElementById('blog-search');
  const yearChips = document.getElementById('year-chips');
  const noResults = document.getElementById('blog-noresults');
  const cards = Array.from(document.querySelectorAll('.post-card'));
  if (!search || !yearChips || !cards.length) return;

  let activeYear = 'all';

  function applyFilter() {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    cards.forEach((card) => {
      const okYear = activeYear === 'all' || card.dataset.year === activeYear;
      const okText = !q || (card.dataset.search || '').includes(q);
      const visible = okYear && okText;
      card.style.display = visible ? '' : 'none';
      if (visible) {
        card.classList.add('show-section'); // reveal immediately (skip scroll wait)
        shown++;
      }
    });
    if (noResults) noResults.hidden = shown > 0;
  }

  search.addEventListener('input', applyFilter);

  yearChips.addEventListener('click', (e) => {
    const btn = e.target.closest('.year-chip');
    if (!btn) return;
    activeYear = btn.dataset.year;
    yearChips.querySelectorAll('.year-chip').forEach((c) => {
      const isSelected = c === btn;
      c.classList.toggle('is-active', isSelected);
      c.setAttribute('aria-pressed', String(isSelected));
    });
    applyFilter();
  });
});
