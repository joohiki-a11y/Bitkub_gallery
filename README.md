Bitkub Media Production — Production Gallery

A single-file, no-build gallery that shows photo albums and videos (YouTube,TikTok, Facebook, and YouTube playlists), driven entirely by a Google Sheet.The app is contained in index.html — no build step or framework install.Host it on any static host such as Netlify or GitHub Pages.

Quick start

Open index.html and fill in CONFIG (near the top):

const CONFIG = {
  SHEET_ID: "your-google-sheet-id",   // between /d/ and /edit in the sheet URL
  ALBUMS_SHEET: "Albums",             // tab name
  MEDIA_SHEET: "Media",               // use "" when the optional tab is unused
  YT_API_KEY: "your-youtube-api-key", // only needed for the `playlist` column
  GESTURE: {
    HERO_PIXELS_PER_ITEM: 220,          // lower = more sensitive
    LIGHTBOX_PIXELS_PER_ITEM: 72,
    TOUCH_SWIPE_THRESHOLD: 56,
    SNAP_DELAY_MS: 90,
  },
};

Share the Google Sheet: Share → Anyone with the link → Viewer.

Upload index.html to your host. Done.

Google Sheet structure

Tab Albums (one row per work) — required

column

meaning

album_id

unique id (used to join Media rows). Don't repeat it.

category

free text — becomes a filter tab (e.g. Photoshoot, Video, Podcast). Blank ⇒ inferred (has video ⇒ Video, else Photo).

title

work title

title_en

subtitle / secondary title

bu_owner (or client)

shown as “BU Owner” in the detail view

year

year

cover

optional cover image URL (overrides the auto thumbnail)

desc

description

photos

one or more direct image URLs (comma/newline separated) — a photos-only album needs nothing else

videos

one or more video links: YouTube / TikTok / Facebook (comma/newline separated, platform auto-detected)

playlist

one or more YouTube playlist links/ids — every video is pulled in as a card (needs YT_API_KEY; playlist must be Public/Unlisted)

spread

yes ⇒ each item (e.g. every playlist clip) becomes its own card that plays on click, instead of one grouped album

Tab Media (one row per item) — optional

For fine-grained control (per-item label / order / mixed photo+video). Omit thetab entirely if you only use the inline photos / videos / playlist columns,and set MEDIA_SHEET: "". If a name is configured but that tab cannot be read,the gallery stays available and shows an on-page warning instead of hiding thefailure.

column

meaning

album_id

must match an Albums row

order

sort order within the album

type

photo or video

mtype

photo / video / youtube / short / highlight

label

caption

src

image URL (for photos; remains backward-compatible)

thumbnail

optional smaller WebP/AVIF/JPEG used in the album grid

full

optional full-resolution image used only in the lightbox

alt

optional accessible description of the photo

yt_id

video link/id (YouTube/TikTok/Facebook)

Notes & caveats

Data source: loaded client-side from the sheet via the gviz JSON endpoint(JSONP, no CORS issue). Albums render first; playlists and TikTok covers arefetched in the background with timeouts, so slow third-party calls never hangthe page.

Thumbnails: YouTube auto; TikTok best-effort via public oEmbed; Facebookhas none client-side. When there's no thumbnail, set cover, else a neutralplay tile is shown.

API key is a client key — it will be visible in the page. Restrict it inGoogle Cloud: HTTP referrer = your domain, API = YouTube Data API v3only, and set a daily quota. Keep the sheet free of anything confidential(it is world-readable).

Videos must be public (private / embedding-disabled clips can't play).

Input validation: malformed media rows and non-HTTP image URLs are ignored.Duplicate album_id rows are reported and only the first row is used becauseMedia relationships cannot be resolved safely when ids repeat.

Navigation: the hero follows a horizontal finger drag on touchscreens anda two-finger horizontal gesture on trackpads, then snaps to the nearest work.The large media preview supports both gestures too. Arrow buttons and keyboardnavigation remain available, and its thumbnail strip can jump directly to anitem. Vertical gestures still scroll normally and multi-touch pinch is leftto the browser. A short gesture hint appears only on the first lightbox visit.

Performance: the hero mounts only nearby cards plus a small animationbuffer; off-screen grid contents use content-visibility, image shimmer stopsafter load, and adjacent full-size photos are preloaded while the lightbox isopen. For large galleries, provide thumbnail and full separately.

Tests

Pure logic (parsing, buildAlbums, platform detection, playlist expansion,spread, dedupe, gesture calculations) is covered by:

npm test

Browser interaction tests use deterministic Sheet/image fixtures and cover theHero trackpad gesture, touch dragging, lightbox navigation, and dialog controls:

npm ci
npx playwright install chromium  # first run only
npm run test:e2e

GitHub Actions runs both suites automatically on pushes and pull requests.
