/* PREVIEW ONLY (rs3-dch-preview): not part of the main app.
   - pictures and map tiles are loaded from the main site instead of being copied here
   - no service worker (so it can't interfere with the main app's offline cache)
   - auto-reloads when a new preview iteration is pushed (version.txt) */
(() => {
  const MAIN = 'https://theelonmuskrs3.github.io/rs3-drop-clue-helper/';
  const RE = /(\bsrc=["'])(?=(?:thumbs|icons|img|cimg|qimg|locimg|mapimg|gicons|maptiles|appicons)\/)/g;
  const fix = s => typeof s === 'string' ? s.replace(RE, '$1' + MAIN) : s;
  const d = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  Object.defineProperty(Element.prototype, 'innerHTML', {get: d.get, set(v) { d.set.call(this, fix(v)); }, configurable: true});
  const ia = Element.prototype.insertAdjacentHTML; Element.prototype.insertAdjacentHTML = function (p, v) { return ia.call(this, p, fix(v)); };
  const isrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', {get: isrc.get, set(v) {
    isrc.set.call(this, typeof v === 'string' && /^(thumbs|icons|img|cimg|qimg|locimg|mapimg|gicons)\//.test(v) ? MAIN + v : v); }, configurable: true});
  const f0 = window.fetch.bind(window);
  window.fetch = (u, o) => f0(typeof u === 'string' && /^(maptiles|thumbs|icons|img|cimg|qimg|locimg|mapimg|gicons)\//.test(u) ? MAIN + u : u, o);
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.scope.includes('rs3-dch-preview') && r.unregister())).catch(() => {});
    try { Object.defineProperty(navigator.serviceWorker, 'register', {value: () => Promise.resolve(null)}); } catch (e) {}
  }
  let cur = null;
  const poll = () => f0('version.txt?t=' + Date.now(), {cache: 'no-store'}).then(r => r.ok ? r.text() : null).then(v => {
    if (!v) return; v = v.trim(); if (cur === null) cur = v; else if (v !== cur) location.reload(); }).catch(() => {});
  poll(); setInterval(poll, 20000);
  addEventListener('DOMContentLoaded', () => { const b = document.createElement('div'); b.id = 'nx-previewtag';
    b.textContent = 'LIVE PREVIEW · auto-refreshes'; b.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:99;font:700 10px/1 Rajdhani,sans-serif;letter-spacing:.2em;color:#00F6FF;padding:6px 10px;border:1px solid rgba(0,246,255,.4);border-radius:999px;background:rgba(5,5,5,.75);pointer-events:none';
    document.body.appendChild(b); });
})();
