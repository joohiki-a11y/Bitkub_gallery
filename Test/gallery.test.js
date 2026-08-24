/**
 * Gallery test suite — zero dependencies, run with:  node tests/gallery.test.js
 *
 * It loads the gallery HTML, extracts the pure functions from its inline script
 * (data parsing, buildAlbums, platform detection, playlist expansion, spread,
 * thumbnails), and asserts their behaviour with stubbed React / fetch. No
 * browser or network required.
 */
"use strict";
const fs = require("fs");
const vm = require("vm");
const path = require("path");

// ---- locate the gallery HTML (repo layouts vary: index.html or Gallery.html)
function findHtml() {
  const cands = [
    process.argv[2],
    "index.html", "Gallery.html", "project/Gallery.html",
    path.join(__dirname, "..", "index.html"),
    path.join(__dirname, "..", "Gallery.html"),
  ].filter(Boolean);
  for (const c of cands) { try { if (fs.statSync(c).isFile()) return c; } catch (e) {} }
  throw new Error("Could not find the gallery HTML (index.html / Gallery.html)");
}

// ---- extract the inline app script and expose its functions
function loadModule() {
  const src = fs.readFileSync(findHtml(), "utf8");
  const tag = src.match(/<script>\s*\n\(function[\s\S]*?<\/script>/);
  if (!tag) throw new Error("inline app <script> not found");
  let body = tag[0].replace(/^<script>\s*/, "").replace(/<\/script>\s*$/, "");
  const inner = body
    .slice(body.indexOf("{") + 1, body.lastIndexOf("})();"))
    .replace(/if \(!window\.React[\s\S]*?return;\s*\}/, "") // strip CDN guard
    .replace(/ReactDOM\.createRoot[\s\S]*?;\s*$/, "");       // strip render call
  const harness =
    "(function(React,ReactDOM,htm,window,document,location,fetch,AbortController,setTimeout,clearTimeout){" +
    inner +
    " return { parseVideo, videoItem, videoEmbed, videoThumb, buildAlbums, gvizToObjects, " +
    "buildTabs, expandPlaylists, enrichThumbs, flattenSpread, ytId, playlistId, splitList, " +
    "imageVariant, imageSrcSet, heroStageAnchor, wrapCarouselPosition, circularTrackpadPosition, circularCarouselOffset, playlistEntriesFromIds }; })";
  const React = { useState: () => [], useEffect: () => {}, useRef: () => ({}), Fragment: 0, createElement: () => ({}) };
  const location = { protocol: "https:", origin: "https://example.netlify.app" };
  return { factory: vm.runInNewContext(harness, { console }), React, location };
}

// ---- tiny test harness
let pass = 0, fail = 0;
const A = (cond, msg) => { console.log((cond ? "  ✅ " : "  ❌ ") + msg); cond ? pass++ : fail++; };
const section = (t) => console.log("\n" + t);

function makeModule(fetchImpl) {
  const { factory, React, location } = loadModule();
  return factory(
    React, { createRoot: () => ({ render: () => {} }) }, { bind: () => () => ({}) },
    {}, { createElement: () => ({}) }, location,
    fetchImpl || (() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })),
    class { abort() {} }, setTimeout, clearTimeout
  );
}

(async () => {
  const M = makeModule();

  section("platform detection (parseVideo)");
  A(M.parseVideo("https://youtu.be/abc123DEF_x").platform === "youtube", "youtu.be ⇒ youtube");
  A(M.parseVideo("https://www.youtube.com/watch?v=abc123DEF_x&t=1").vid === "abc123DEF_x", "watch?v= id extracted");
  A(M.parseVideo("abc123DEF_x").platform === "youtube", "bare 11-char id ⇒ youtube");
  A(M.parseVideo("https://www.tiktok.com/@u/video/7411111111111111111").platform === "tiktok", "tiktok detected");
  A(M.parseVideo("https://www.tiktok.com/@u/video/7411111111111111111").vid === "7411111111111111111", "tiktok id extracted");
  A(M.parseVideo("https://www.facebook.com/watch/?v=123").platform === "facebook", "facebook detected");
  A(M.parseVideo("https://vimeo.com/12345").platform === "unknown", "unknown link ⇒ unknown (not forced youtube)");

  section("embed urls");
  A(M.videoEmbed(M.videoItem("https://youtu.be/abc123DEF_x")).includes("youtube.com/embed/abc123DEF_x"), "youtube embed");
  A(M.videoEmbed(M.videoItem("https://www.tiktok.com/@u/video/7411111111111111111")).includes("tiktok.com/player/v1/"), "tiktok player");
  A(M.videoEmbed(M.videoItem("https://www.facebook.com/watch/?v=123")).includes("facebook.com/plugins/video.php"), "facebook plugin");
  A(M.videoEmbed(M.videoItem("https://vimeo.com/12345")) === "", "unknown ⇒ no embed");

  section("thumbnails");
  A(M.videoThumb(M.videoItem("https://youtu.be/abc123DEF_x"), "maxresdefault").includes("abc123DEF_x/maxresdefault"), "youtube thumb");
  A(M.videoThumb(M.videoItem("https://www.tiktok.com/@u/video/7411111111111111111"), "maxresdefault") === "", "tiktok has no direct thumb");
  const cloudinary = "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg";
  A(M.imageVariant(cloudinary, 720).includes("/f_auto,q_auto:good,c_limit,w_720/"), "cloudinary previews are resized and compressed");
  A(M.imageVariant("https://example.com/photo.jpg", 720) === "https://example.com/photo.jpg", "non-cloudinary URLs are unchanged");
  A(M.imageSrcSet(cloudinary, [420, 720]).includes("420w") && M.imageSrcSet(cloudinary, [420, 720]).includes("720w"), "responsive Cloudinary srcset is generated");

  section("buildAlbums: inline photos/videos, category, cover");
  const at = { cols: [{ label: "album_id" }, { label: "category" }, { label: "title" }, { label: "bu_owner" }, { label: "photos" }, { label: "videos" }],
    rows: [
      { c: [{ v: "a1" }, { v: "Photoshoot" }, { v: "รูป" }, { v: "BU-A" }, { v: "https://img/1.jpg,https://img/2.jpg" }, null] },
      { c: [{ v: "a2" }, null, { v: "คลิป" }, { v: "BU-B" }, null, { v: "https://youtu.be/abc123DEF_x" }] },
    ] };
  let albums = M.buildAlbums(M.gvizToObjects(at), []);
  A(albums.length === 2, "2 works built with NO media tab");
  A(albums[0].media.length === 2 && albums[0].client === "BU-A", "photos album: 2 items + bu_owner");
  A(albums[0].cover === "https://img/1.jpg", "photo album cover from first photo");
  A(albums[1].category === "Video", "blank category + video ⇒ inferred Video");
  A(albums[1].cover.includes("maxresdefault"), "video album cover = youtube maxres");

  section("dynamic tabs (from sheet categories, case-insensitive, first-seen order)");
  const tabs = M.buildTabs(albums);
  A(tabs[0].key === "all", "All tab first");
  A(tabs.map((t) => t.label).join("|") === "All|Photoshoot|Video", "tabs from distinct categories");

  section("album_id dedupe");
  const dup = M.buildAlbums(M.gvizToObjects({ cols: [{ label: "album_id" }, { label: "photos" }],
    rows: [{ c: [{ v: "d" }, { v: "https://img/1.jpg" }] }, { c: [{ v: "d" }, { v: "https://img/2.jpg" }] }] }), []);
  A(dup.length === 1 && dup[0].cover === "https://img/1.jpg", "duplicate album_id keeps the first row only");

  section("spread: one card per media item");
  const sp = M.buildAlbums(M.gvizToObjects({ cols: [{ label: "album_id" }, { label: "category" }, { label: "title" }, { label: "videos" }, { label: "spread" }],
    rows: [{ c: [{ v: "s" }, { v: "Short" }, { v: "รวม" }, { v: "https://youtu.be/AAA111aaaaa,https://youtu.be/BBB222bbbbb" }, { v: "yes" }] }] }), []);
  const flat = M.flattenSpread(sp);
  A(flat.length === 2 && flat[0].media.length === 1, "spread=yes ⇒ 2 single-media cards");

  section("playlist expansion (mocked YouTube Data API)");
  const plFetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ items: [
    { snippet: { resourceId: { videoId: "PL1aaaaaaaa" }, title: "ตอน 1" } },
    { snippet: { resourceId: { videoId: "PL2bbbbbbbb" }, title: "Private video" } }, // skipped
  ] }) });
  const M2 = makeModule(plFetch);
  const pa = M2.buildAlbums(M2.gvizToObjects({ cols: [{ label: "album_id" }, { label: "category" }, { label: "title" }, { label: "playlist" }],
    rows: [{ c: [{ v: "p" }, { v: "Series" }, { v: "ซีรีส์" }, { v: "https://youtube.com/playlist?list=PLx" }] }] }), []);
  const errs = await M2.expandPlaylists(pa);
  A(errs.length === 0, "playlist fetch: no errors");
  A(pa[0].media.length === 1 && pa[0].media[0].vid === "PL1aaaaaaaa", "playlist expanded (Private skipped)");

  section("playlist fallback when YouTube Data API rejects the request");
  const blockedFetch = () => Promise.resolve({ ok: false, status: 403, json: () => Promise.resolve({ error: { message: "Requests from referer are blocked." } }) });
  const MBlocked = makeModule(blockedFetch);
  const fallbackAlbums = MBlocked.buildAlbums(MBlocked.gvizToObjects({ cols: [{ label: "album_id" }, { label: "category" }, { label: "title" }, { label: "playlist" }],
    rows: [{ c: [{ v: "pf" }, { v: "TJ Content" }, { v: "รายการตัวอย่าง" }, { v: "https://youtube.com/playlist?list=PLfallback" }] }] }), []);
  const fallbackErrors = await MBlocked.expandPlaylists(fallbackAlbums);
  A(fallbackErrors.length === 1, "blocked playlist expansion returns a non-fatal warning");
  A(fallbackAlbums[0].media.length === 1 && fallbackAlbums[0].media[0].platform === "youtube-playlist", "blocked playlist remains visible as one playable item");
  A(MBlocked.videoEmbed(fallbackAlbums[0].media[0]).includes("youtube.com/embed/videoseries?list=PLfallback"), "playlist fallback opens the YouTube playlist player");
  const playerItems = M.playlistEntriesFromIds(["AAA111aaaaa", "BBB222bbbbb", "AAA111aaaaa", "bad"], "Topp Talks");
  A(playerItems.length === 2, "player fallback converts and deduplicates playlist video ids");
  A(playerItems[1].label === "Topp Talks · คลิป 2", "player fallback gives each clip a useful ordered label");

  section("tiktok oEmbed enrichment (mocked)");
  const tkFetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ thumbnail_url: "https://tk/thumb.jpg" }) });
  const M3 = makeModule(tkFetch);
  const ta = M3.buildAlbums(M3.gvizToObjects({ cols: [{ label: "album_id" }, { label: "title" }, { label: "videos" }],
    rows: [{ c: [{ v: "t" }, { v: "tk" }, { v: "https://www.tiktok.com/@u/video/7411111111111111111" }] }] }), []);
  await M3.enrichThumbs(ta);
  A(ta[0].cover === "https://tk/thumb.jpg", "tiktok cover filled from oEmbed");

  section("UX round one safeguards");
  const source = fs.readFileSync(findHtml(), "utf8");
  A((source.match(/aria-label="กรองผลงานตามหมวดหมู่"/g) || []).length === 1, "only one category filter navigation is rendered");
  A(source.includes('aria-pressed=${on ? "true" : "false"}'), "filter buttons expose their selected state");
  A(source.includes('overflowX: "clip"'), "the page does not create an overflow ancestor that breaks sticky filters");
  A(source.includes("เนื้อหาบางรายการยังโหลดไม่ครบ"), "non-fatal errors use a concise user-facing notice");
  A(source.includes("setTimeout(() => setShow(false), 7000)"), "the non-fatal notice dismisses itself before blocking navigation");
  A(source.includes("imagePreviewFallback(e, album.cover)"), "optimized covers fall back to their original URL when needed");
  A(source.includes("compactAlbum ? \"repeat(auto-fit"), "small albums use a centered adaptive grid");
  A(source.includes("album.client && html"), "empty BU Owner metadata is hidden");

  section("hero edge preview");
  A(M.heroStageAnchor(0, 1) === 50, "a single cover remains centered");
  A(M.heroStageAnchor(0, 5) === 34, "the first cover shifts left to reveal upcoming covers");
  A(M.heroStageAnchor(0.5, 5) === 42, "the edge bias follows fractional touchpad movement");
  A(M.heroStageAnchor(1, 5) === 50, "middle covers return to the stage center");
  A(M.heroStageAnchor(4, 5) === 66, "the last cover shifts right to reveal previous covers");
  A(source.includes("anchor + off * 30"), "hero previews have balanced horizontal spacing around the active card");
  A(source.includes("Math.min(0.72, 0.5"), "adjacent covers use a clear progressive fade");
  A(M.wrapCarouselPosition(-1, 5) === 4, "hero previous navigation loops from first to last");
  A(M.wrapCarouselPosition(5, 5) === 0, "hero next navigation loops from last to first");
  A(M.circularCarouselOffset(4, 0, 5) === -1, "last Hero card is the previous neighbour of the first");
  A(M.circularCarouselOffset(0, 4, 5) === 1, "first Hero card is the next neighbour of the last");
  A(M.circularTrackpadPosition(4.8, 110, 5) < 1, "trackpad movement wraps continuously across the Hero boundary");
  A((source.match(/circularTrackpadPosition\(/g) || []).length >= 3, "touch and trackpad Hero gestures both use circular movement");
  A(source.includes('const heroAnchor = 50'), "looped Hero keeps the active card centered between two previews");
  A(source.includes('zIndex: 60'), "sticky filter bar stays above Hero cards while scrolling");
  A(source.includes('isolation: "isolate"'), "Hero card stacking is isolated beneath the sticky filter bar");
  A(source.includes('clamp(320px, min(38vw, 48vh), 450px)'), "Hero height responds to both viewport width and height");
  A(source.includes('fontSize: "clamp(34px,5vw,64px)"'), "page title keeps a compact responsive hierarchy");
  A(source.includes('script.src = "https://www.youtube.com/iframe_api"'), "playlist recovery uses the official YouTube IFrame API");
  A(source.includes('objectFit: isVideo ? "cover" : "contain"'), "video thumbnails fill their 16:9 frame");

  section("responsive brand background");
  A(source.includes('url("assets/brand-construction-bg-clean-1x.webp")'), "desktop uses the clean construction-grid background asset");
  A(source.includes('url("assets/brand-construction-bg-clean-2x.webp") 2x'), "desktop provides a crisp Retina background asset");
  A(source.includes('url("assets/brand-construction-bg-mobile-clean-1x.webp")'), "mobile uses the clean portrait background asset");
  A(source.includes('url("assets/brand-construction-bg-mobile-clean-2x.webp") 2x'), "mobile provides a crisp Retina background asset");
  A((source.match(/background-image: image-set\(/g) || []).length === 2, "desktop and mobile select background resolution by device pixel ratio");
  A(source.includes('body::before'), "background remains fixed behind the scrolling gallery");
  A(source.includes('background: "transparent", minHeight: "100vh"'), "the gallery surface reveals the branded background");

  console.log(`\n${fail ? "❌" : "✅"} ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
