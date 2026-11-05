# Blog post: OpenUBEM — implementation plan

**Status:** approved with defaults and built 2026-11-05 · **Drafted:** 2026-11-05
**Source of all claims:** the OpenUBEM README (`github.com/orcunkoraliseri/OpenUBEM`, read 2026-11-05). Nothing below is written from memory.

## What gets built

1. **New post file:** `content/blog/posts/openubem-open-source-urban-building-energy-modeling.html`
   Copied from the hand-made `journal-at-2026-occupancy-*.html` pattern (same header, topbar, `post-article`, relative links).
2. **Image(s):** downloaded from the public repo into `content/blog/posts/img/` (no hotlinking):
   - `openubem-graphical-abstract.jpg` ← `docs/images/openubem_graphical_abstract_3d.jpg` (post hero + card thumbnail)
   - *optional:* one neighbourhood 3D image, e.g. `docs/images/neighbourhoods/madrid_heating_eui_3d.png`
3. **`blog.html`:** insert one `.post-card` at the top (newest, above the Feb 27 2026 card) with `data-year="2026"` and a lowercase `data-search` string. Update counts: **All 51 → 52**, **2026: 2 → 3**.
4. **Docs:** add a `walkthrough.md` next to this plan, a Session Log line and the blog count (51 → 52) in `Prompt/MANAGER_PROMPT.md`.
5. **Not touched:** `tools/build-blog.js` (never run), desktop CSS, `mobile.css`.

Verification: headless-Chrome screenshot of the post and of the top of `blog.html` at 1440px, post pages at phone width via the iframe recipe (§6), check card link works, search "openubem" finds it, year chip counts match.

## Draft text (short, ~300 words)

**Title:** OpenUBEM: An Open-Source Toolkit for Urban Building Energy Modeling
**Meta line:** Published · Nov 5, 2026
**Labels:** openubem · UBEM · EnergyPlus · open source · Python

> *[graphical abstract image]*
>
> I have been developing **OpenUBEM**, an open-source toolkit for urban building energy modeling. Give it a neighbourhood — an address, a coordinate bounding box, or a GIS footprint export — and it estimates the annual energy consumption, hourly load profiles, and operational carbon emissions of every building inside it, without needing per-building utility audits.
>
> **How it works**
> Each building is assigned an archetype, resolved into multi-dwelling thermal zones, extruded from its real footprint polygon with 20 m context shading, and simulated with whole-building EnergyPlus physics. The workflow is a modular, resume-capable pipeline:
> 1. Data acquisition (OpenStreetMap, cadastre, 3D building data)
> 2. Semantic enrichment (archetypes and ERA5 climate)
> 3. IDF generation (dwelling layouts and shading envelope)
> 4. EnergyPlus simulation (multi-process)
> 5. Results and carbon accounting, with an interactive 3D viewer
>
> An optional sixth step adds outdoor microclimate (UTCI/PET).
>
> **Key features**
> - Every reported kWh comes from native EnergyPlus meters; no fitted multipliers.
> - True footprint geometry with context shading, not shoebox proxies.
> - US archetypes (DOE/ASHRAE 90.1) and European building stocks (TABULA/EPISCOPE).
> - Standalone WebGL 3D viewers that need no server.
> - Every input field carries a provenance token: observed, imputed, or standard default.
>
> **Where it has run**
> OpenUBEM has been executed across 10 residential districts in 10 countries on 4 continents, and checked against NYC Local Law 84, CBECS 2018, and LA EBEWE benchmarks.
>
> OpenUBEM is dual-licensed under Apache 2.0 or MIT. The code, installation steps, and full documentation are on GitHub: [github.com/orcunkoraliseri/OpenUBEM](https://github.com/orcunkoraliseri/OpenUBEM). It is also listed under My Tools on the [Skills & Tools](../../../skills.html) page.

## Decisions for you

1. **Date:** Nov 5, 2026 (today) — or another date?
2. **Images:** graphical abstract only, or also one neighbourhood 3D image (which city)?
3. **Tone:** first person ("I have been developing…") as drafted, or neutral?
4. **Claims to review:** "10 districts / 10 countries / 4 continents" and the three validation benchmarks come straight from the README. Please confirm you are happy to state them publicly.

## Flag: Skills card vs README

The OpenUBEM card in `skills.html` says "30 DOE archetypes" and "validated against measured data on 8,160 buildings in New York, Los Angeles, and Austin". The current README mentions neither number; it describes European/global coverage (10 districts) and NYC LL84 / CBECS / LA EBEWE validation. I did **not** reuse the 30 / 8,160 figures in the post. Ask: should the Skills card be updated to match the README?
