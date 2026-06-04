document.addEventListener('DOMContentLoaded', () => {

  // ---- Scroll-triggered entrance animations for blog post cards ----
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show-section');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.1 });

  document.querySelectorAll('.hidden-section').forEach(sec => observer.observe(sec));

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
    cards.forEach(card => {
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
    yearChips.querySelectorAll('.year-chip').forEach(c => c.classList.toggle('is-active', c === btn));
    applyFilter();
  });

});
