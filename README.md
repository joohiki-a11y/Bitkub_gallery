# Bitkub Media Production — Production Gallery

A single-file, no-build gallery that shows photo albums and videos (YouTube,
TikTok, Facebook, and YouTube playlists), driven entirely by a Google Sheet.
Everything is in **`index.html`** (`Gallery.html` in this bundle) — no build
step, no framework install. Host it on any static host (Netlify, GitHub Pages).

## Quick start

1. Open `index.html` and fill in `CONFIG` (near the top):
   ```js
   const CONFIG = {
     SHEET_ID: "your-google-sheet-id",   // between /d/ and /edit in the sheet URL
     ALBUMS_SHEET: "Albums",             // tab name
     MEDIA_SHEET: "Media",               // tab name (optional — see below)
     YT_API_KEY: "your-youtube-api-key", // only needed for the `playlist` column
   };
   ```
2. Share the Google Sheet: **Share → Anyone with the link → Viewer**.
3. Upload `index.html` to your host. Done.

## Google Sheet structure

### Tab `Albums` (one row per work) — **required**

| column | meaning |
| --- | --- |
| `album_id` | unique id (used to join Media rows). Don't repeat it. |
| `category` | free text — becomes a filter tab (e.g. `Photoshoot`, `Video`, `Podcast`). Blank ⇒ inferred (has video ⇒ Video, else Photo). |
| `title` | work title |
| `title_en` | subtitle / secondary title |
| `bu_owner` (or `client`) | shown as “BU Owner” in the detail view |
| `year` | year |
| `cover` | optional cover image URL (overrides the auto thumbnail) |
| `desc` | description |
| `photos` | one or more **direct image URLs** (comma/newline separated) — a photos-only album needs nothing else |
| `videos` | one or more video links: **YouTube / TikTok / Facebook** (comma/newline separated, platform auto-detected) |
| `playlist` | one or more **YouTube playlist** links/ids — every video is pulled in as a card (needs `YT_API_KEY`; playlist must be Public/Unlisted) |
| `spread` | `yes` ⇒ each item (e.g. every playlist clip) becomes its own card that plays on click, instead of one grouped album |

### Tab `Media` (one row per item) — **optional**

For fine-grained control (per-item label / order / mixed photo+video). Omit the
tab entirely if you only use the inline `photos` / `videos` / `playlist` columns.

| column | meaning |
| --- | --- |
| `album_id` | must match an Albums row |
| `order` | sort order within the album |
| `type` | `photo` or `video` |
| `mtype` | `photo` / `video` / `youtube` / `short` / `highlight` |
| `label` | caption |
| `src` | image URL (for photos) |
| `yt_id` | video link/id (YouTube/TikTok/Facebook) |

## Notes & caveats

- **Data source:** loaded client-side from the sheet via the gviz JSON endpoint
  (JSONP, no CORS issue). Albums render first; playlists and TikTok covers are
  fetched in the background with timeouts, so slow third-party calls never hang
  the page.
- **Thumbnails:** YouTube auto; TikTok best-effort via public oEmbed; Facebook
  has none client-side. When there's no thumbnail, set `cover`, else a neutral
  play tile is shown.
- **API key** is a client key — it will be visible in the page. Restrict it in
  Google Cloud: **HTTP referrer = your domain**, **API = YouTube Data API v3
  only**, and set a daily quota. Keep the sheet free of anything confidential
  (it is world-readable).
- **Videos must be public** (private / embedding-disabled clips can't play).

## Tests

Pure logic (parsing, `buildAlbums`, platform detection, playlist expansion,
spread, dedupe) is covered by a zero-dependency test:

```bash
node tests/gallery.test.js        # or: node tests/gallery.test.js path/to/index.html
```
