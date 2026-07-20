# Simbali Wild Safaris Day 12 Run Summary

## Run

- Run date: 2026-07-21 Africa/Nairobi
- Campaign day: 12
- Branch: `codex/simbali-blog-day-12-2026-07-21`
- Slug created: `safari-photography-tips-wildlife-photos`

## Source Files Read

- `D:\CODEX PROJECTS\Sambali Wild Safaris\plan.md`
- `D:\CODEX PROJECTS\Sambali Wild Safaris\MASTER_INDEX.md`
- `D:\CODEX PROJECTS\Sambali Wild Safaris\blog_prompts\day_12.md`
- `D:\CODEX PROJECTS\Sambali Wild Safaris\instagram_prompts\day_12.md`

## Astro Files Changed

- `src/pages/blog/index.astro`
  - Added the Day 12 Safari Photography post at the top of the blog listing.
- `src/pages/blog/[slug].astro`
  - Added Day 12 metadata to `getStaticPaths()`.
  - Added Day 12 `relatedSafaris` entries using existing itinerary anchors from `src/data/itineraries.ts`.
  - Added the Day 12 article body to `blogContent`.
  - Added the new slug to `allSlugs`.
  - Added the new post to the More Stories `otherPosts` map.

## Blog Images

Canva export/download was not available in the exposed connector tools, so existing local repository images were used:

- Hero/listing: `/images/lions-safari-vehicle-simbali-wild-safaris.jpg`
- Supporting: `/images/raptor-bird-flying-clear-sky_blog.jpg`
- Supporting: `/images/african-elephant-savanna-simbali-wild-safaris.jpg`
- Supporting: `/images/open-jeep-game-drive-simbali-wild-safaris.jpg`

Desired Canva/Pixabay search terms:

- wildlife photography Africa lion
- safari jeep camera photographer
- African elephant golden hour
- camera telephoto lens wildlife
- Maasai Mara sunset silhouette

## MP4 Images

The MP4 uses existing local repository images:

- `public/images/lions-safari-vehicle-simbali-wild-safaris.jpg`
- `public/images/safari-rally-car-simbali-wild-safaris.jpg`
- `public/images/lioness-service.jpg`
- `public/images/african-elephant-savanna-simbali-wild-safaris.jpg`
- `public/images/raptor-bird-flying-clear-sky_blog.jpg`
- `public/images/open-jeep-game-drive-simbali-wild-safaris.jpg`
- `public/images/baobab-sunset-safari-simbali-wild-safaris.jpg`

## Validation Results

- `python scripts/render_simbali_day12_reel.py`: passed.
- MP4 metadata: H.264, yuv420p(progressive), 1080x1920, 30fps, 28.0 seconds, 4,320,011 bytes.
- Visual spot-check: cover JPG and CTA frame reviewed; text is legible and safe margins are acceptable.
- `npm run build`: passed. Astro built 15 pages, including `/blog/safari-photography-tips-wildlife-photos/`.

Environment notes:

- `npm install` reported the project requires Node 20 while this machine is running Node v24.11.1.
- `npm install` reported 6 audit findings before any dependency changes by this automation.
- `ffprobe` was not on PATH, so MP4 metadata was verified with `imageio` and the bundled `imageio-ffmpeg` binary.

## Canva Result

Canva connector discovery showed design generation/import/edit tools, but no usable export/download tool for commit-ready images or MP4 publishing. No Canva edit/view URLs, time-limited thumbnails, or private asset URLs were used.

## Instagram Result

Instagram status: MP4 created; posting requires Instagram/Meta or Canva scheduler connection. No authenticated publishing connector was available, so no post was scheduled or published.

## Git Status

- Branch prepared: `codex/simbali-blog-day-12-2026-07-21`
- Commit status: committed as `5d1940a` initially, then amended after final PR status summary.
- Push status: pushed to `origin/codex/simbali-blog-day-12-2026-07-21`.
- PR status: draft PR opened at https://github.com/samwiseuggit/Simbali-Wild-Safaris/pull/7.
- PR labels: `codex`, `codex-automation`.

## Issues

- The source branch already contains static Astro pages for some earlier generated campaign posts while `[slug].astro` only routes a subset through `getStaticPaths()`. The Day 12 post was wired into the dynamic route and navigation maps as requested without restructuring older posts.
