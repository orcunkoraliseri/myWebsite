# Blog post: OpenUBEM — walkthrough

**Built:** 2026-11-05, using the defaults from `implementation_plan.md` (date Nov 5 2026, graphical abstract only, first person).

## What changed
- New `content/blog/posts/openubem-open-source-urban-building-energy-modeling.html` (copied from the hand-made journal-post pattern; topbar links to home and Skills & Tools).
- New image `content/blog/posts/img/openubem-graphical-abstract.jpg` (from the OpenUBEM repo, `docs/images/openubem_graphical_abstract_3d.jpg`).
- `blog.html`: new top `.post-card`; counts All 51 → 52, 2026 2 → 3.
- `README.md` and `Prompt/MANAGER_PROMPT.md`: counts, hand-added-post list (now 6), session log.

## Verified
- Headless Chrome 1440px: post page and top of `blog.html` render as expected, chips show All 52 / 2026 3.
- Post page at 390px (iframe check): `scrollWidth` = 390, no horizontal overflow.
- `blog.html` has 52 `.post-card` anchors.

## Known / left as-is
- `skills.html` OpenUBEM card still cites "30 DOE archetypes" and "8,160 buildings"; the current README no longer mentions them. Left unchanged at the owner's request.
- `tools/build-blog.js` not run; the new post is not in the Atom feed, so it joins the list of hand-added posts.
