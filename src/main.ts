import './style.css';
import { asCsv, EMPTY_MAP, FREE_CLAIM_LIMIT, makeClaim, recordRehearsal, sanitizeMap, validateRehearsal, type Claim, type ClaimStatus, type MapData } from './model';

const STORAGE_KEY = 'kbm:map:v1';
const THEME_KEY = 'kbm:theme';
const LICENSE_KEY = 'sb_license:knowledge-boundary-map';
const VERDICT_KEY = 'sb_license_verdict:knowledge-boundary-map';
const BILLING_BASE = (import.meta.env.VITE_BILLING_API_BASE || 'https://api.sociobot.in').replace(/\/$/, '');
const CHECKOUT_URL = `${BILLING_BASE}/api/v1/products/knowledge-boundary-map/checkout`;

type LicenseVerdict = { valid: boolean; checkedAt: number; reason?: string };

let storageAvailable = true;
let map: MapData = loadMap();
let licenseToken = safeGet(LICENSE_KEY) ?? '';
let licenseVerdict = readVerdict();
let selectedClaimId = '';
let timerId = 0;
let secondsLeft = 90;
let lastRemoved: { claim: Claim; index: number; dependentIds: string[] } | null = null;
let toastTimer = 0;

const app = document.querySelector<HTMLDivElement>('#app')!;

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { storageAvailable = false; return null; }
}

function safeSet(key: string, value: string): boolean {
  try { localStorage.setItem(key, value); return true; } catch { storageAvailable = false; return false; }
}

function loadMap(): MapData {
  try {
    const raw = safeGet(STORAGE_KEY);
    return raw ? sanitizeMap(JSON.parse(raw)) : structuredClone(EMPTY_MAP);
  } catch {
    return structuredClone(EMPTY_MAP);
  }
}

function saveMap(): void {
  const saved = safeSet(STORAGE_KEY, JSON.stringify(map));
  if (!saved) showToast('This browser blocked local storage. Export before leaving this page.');
}

function readVerdict(): LicenseVerdict | null {
  try {
    const parsed = JSON.parse(safeGet(VERDICT_KEY) ?? 'null') as LicenseVerdict | null;
    return parsed && typeof parsed.valid === 'boolean' ? parsed : null;
  } catch { return null; }
}

function isUnlocked(): boolean {
  return Boolean(licenseToken && licenseVerdict?.valid);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]!);
}

function statusLabel(status: ClaimStatus): string {
  return { untested: 'Not rehearsed', explain: 'Can explain', recognize: 'Recognize only', blocked: 'Blocked' }[status];
}

function icon(name: 'lock' | 'moon' | 'sun' | 'plus' | 'download'): string {
  const paths = {
    lock: '<rect x="6" y="10" width="12" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    moon: '<path d="M20 15.2A8 8 0 0 1 8.8 4 8 8 0 1 0 20 15.2Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/>',
  };
  return `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

function header(): string {
  const dark = document.documentElement.dataset.theme === 'dark';
  return `<header class="site-header">
    <a class="brand" href="/" data-route aria-label="Knowledge Boundary Map home"><span class="brand-mark" aria-hidden="true">↗</span><span>Knowledge Boundary Map</span></a>
    <nav class="header-actions" aria-label="Primary navigation">
      <a class="nav-link" href="/upgrade" data-route>${isUnlocked() ? 'Studio unlocked' : 'Lifetime studio'}</a>
      <button class="icon-button" id="theme-toggle" type="button" aria-label="Use ${dark ? 'light' : 'dark'} theme">${icon(dark ? 'sun' : 'moon')}</button>
    </nav>
  </header><p class="offline-banner${navigator.onLine ? '' : ' visible'}" role="status">You’re offline. Your map still works and stays on this device.</p>`;
}

function footer(): string {
  return `<footer class="site-footer"><span>Private by default · Stored in this browser · No account</span><nav class="footer-links" aria-label="Legal"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a><a href="https://github.com/B-Divyesh/sf-knowledge-boundary-map" rel="noreferrer">Source</a></nav><span>Original AI-generated paper artwork · <a href="/privacy" data-route>details</a></span></footer>`;
}

function layout(content: string): string {
  return `<div class="shell">${header()}${!storageAvailable ? '<p class="license-note storage-warning" role="alert">Local storage is unavailable. Your changes may not survive a refresh; export a copy before leaving.</p>' : ''}${content}${footer()}<div class="toast" id="toast" role="status" aria-live="polite"><span id="toast-message"></span><button type="button" id="toast-action" hidden>Undo</button></div></div>`;
}

function heroPage(): string {
  return layout(`<main class="site-main" id="main"><section class="hero">
    <div class="hero-copy"><p class="eyebrow">Your notes say “familiar.” Can you teach it?</p><h1>Find the edge of what you can explain.</h1>
    <p class="lede">Pin a claim, connect what it depends on, then try a 90-second teach-back. You decide whether you can explain it, only recognize it, or found a block.</p>
    <div class="hero-actions"><button class="button primary" id="start-map" type="button">${icon('plus')} Pin your first claim</button><button class="button quiet" id="load-example" type="button">Try a three-claim example</button></div>
    <p class="privacy-note">${icon('lock')} <span>No sign-up and no cloud sync. Your map stays in this browser unless you export it.</span></p></div>
    <figure class="hero-art"><picture><source srcset="/assets/boundary-diorama.avif" type="image/avif"><source srcset="/assets/boundary-diorama.webp" type="image/webp"><img src="/assets/boundary-diorama.webp" width="1152" height="768" fetchpriority="high" decoding="async" alt="Layered paper hills form a path from blue fog past an orange obstacle toward a clear golden marker."></picture><figcaption>A boundary is useful when it becomes your next route—not a verdict about intelligence.</figcaption></figure>
  </section>${claimDialog()}</main>`);
}

function mapPage(): string {
  const counts = (['explain', 'recognize', 'blocked', 'untested'] as ClaimStatus[]).map((status) => [status, map.claims.filter((claim) => claim.status === status).length] as const);
  const limitText = isUnlocked() ? `${map.claims.length} claims · Studio unlocked` : `${map.claims.length} of ${FREE_CLAIM_LIMIT} free claims`;
  return layout(`<main class="site-main" id="main">
    <div class="map-header"><div><p class="eyebrow">Boundary workshop</p><h1>Your explanation map</h1><label for="topic" class="visually-hidden">Topic name</label><input id="topic" class="topic-input" type="text" maxlength="120" value="${escapeHtml(map.topic)}" placeholder="Name this topic (optional)"></div>
    <div class="button-row"><button class="button primary" id="new-claim" type="button">${icon('plus')} Pin a claim</button><button class="button quiet" id="export-menu" type="button">${icon('download')} Export</button></div></div>
    ${licenseVerdict && !licenseVerdict.valid && licenseToken ? `<p class="license-note">Your saved license is no longer active. The free map still works. <a href="${CHECKOUT_URL}">Get a new license</a>.</p>` : ''}
    <p class="visually-hidden" id="boundary-ledger-help">This summary scrolls horizontally on narrow screens. Focus it, then use the Left and Right Arrow keys to review every status.</p>
    <ul class="boundary-ledger" tabindex="0" aria-label="Self-assessed boundary summary" aria-describedby="boundary-ledger-help">${counts.map(([status, count]) => `<li class="ledger-item ${status}"><strong>${count}</strong><span>${statusLabel(status)}</span></li>`).join('')}</ul>
    <div class="workspace"><section class="map-section" aria-labelledby="claim-map-title"><div class="section-heading"><h2 id="claim-map-title">Claim map</h2><span class="microcopy">${limitText}</span></div>
      <p class="map-help" id="map-instructions">Tab through claims, or use arrow keys within the map. Press Enter to rehearse the focused claim.</p>
      <div class="map-canvas" id="map-canvas">${mapContents()}</div><p class="visually-hidden">${dependencySummary()}</p>
    </section>${probePanel()}</div>
    ${claimDialog()}${rehearsalDialog()}${exportDialog()}
  </main>`);
}

function mapContents(): string {
  if (!map.claims.length) return `<div class="empty-map"><div class="empty-map-inner"><div class="paper-stack" aria-hidden="true"></div><h2>Your boundary is still blank</h2><p>Start with one claim you feel confident about. Testing confidence is the point.</p><button class="button primary" id="empty-add" type="button">Pin a claim</button></div></div>`;
  const byId = new Map(map.claims.map((claim) => [claim.id, claim]));
  return `<svg class="map-links" id="map-links" aria-hidden="true"></svg><ul class="claim-list" aria-describedby="map-instructions">${map.claims.map((claim, index) => {
    const prerequisiteNames = claim.prerequisiteIds.map((id) => byId.get(id)?.title).filter((name): name is string => Boolean(name));
    return `<li class="claim-card" data-node="${escapeHtml(claim.id)}"><button class="claim-paper" type="button" data-claim-id="${escapeHtml(claim.id)}" data-status="${claim.status}" ${index === 0 ? 'tabindex="0"' : 'tabindex="-1"'} aria-current="${selectedClaimId === claim.id}"><span class="claim-status"><span class="status-dot"></span>${statusLabel(claim.status)}</span><span class="claim-title">${escapeHtml(claim.title)}</span>${claim.context ? `<span class="claim-context">${escapeHtml(claim.context)}</span>` : ''}<span class="prereq-label">${prerequisiteNames.length ? `Needs: ${prerequisiteNames.map(escapeHtml).join(', ')}` : 'No prerequisites pinned'}</span></button></li>`;
  }).join('')}</ul>`;
}

function dependencySummary(): string {
  const byId = new Map(map.claims.map((claim) => [claim.id, claim.title]));
  const descriptions = map.claims.map((claim) => claim.prerequisiteIds.length ? `${claim.title} depends on ${claim.prerequisiteIds.map((id) => byId.get(id)).filter(Boolean).join(' and ')}.` : `${claim.title} has no prerequisite.`);
  return `Text alternative for map. ${descriptions.join(' ')}`;
}

function probePanel(): string {
  const blocked = map.claims.filter((claim) => claim.status === 'blocked');
  const recognize = map.claims.filter((claim) => claim.status === 'recognize');
  const untested = map.claims.filter((claim) => claim.status === 'untested');
  const next = blocked[0] ?? recognize[0] ?? untested[0] ?? [...map.claims].sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))[0];
  return `<aside class="probe-panel" aria-labelledby="next-probe-title"><div><p class="eyebrow">Next edge</p><h2 id="next-probe-title">${next ? escapeHtml(next.title) : 'Pin a claim'}</h2></div><div>${next ? `<p>${next.nextProbe ? escapeHtml(next.nextProbe) : next.status === 'untested' ? 'Try explaining it without opening your notes.' : 'Write one question that could change this assessment.'}</p><button class="button" data-rehearse="${escapeHtml(next.id)}" type="button">Rehearse this claim</button>` : '<p>Your next probe will appear here after you pin a claim.</p>'}<ol class="probe-list"><li>Explain from memory.</li><li>Name what it depends on.</li><li>Find a boundary or counterexample.</li></ol></div></aside>`;
}

function claimDialog(): string {
  const atLimit = map.claims.length >= FREE_CLAIM_LIMIT && !isUnlocked();
  return `<dialog id="claim-dialog" aria-labelledby="claim-dialog-title"><div class="dialog-paper"><div class="dialog-head"><div><p class="eyebrow">New paper slip</p><h2 id="claim-dialog-title">Pin a claim</h2><p class="muted">Write something specific enough to explain or disprove.</p></div><button class="close-button" type="button" data-close aria-label="Close">×</button></div>
    ${atLimit ? `<div class="license-note"><strong>Your free workshop holds ${FREE_CLAIM_LIMIT} claims.</strong><br>Export is always free. The $12 lifetime unlock removes the claim limit. <a href="/upgrade" data-route>See the unlock</a>.</div>` : `<form id="claim-form"><div id="claim-errors" class="error-box" role="alert"></div><div class="field"><label for="claim-title">Claim <span aria-hidden="true">*</span></label><input id="claim-title" name="title" type="text" maxlength="160" required aria-describedby="claim-title-hint"><p class="field-hint" id="claim-title-hint">Example: “Gradient descent follows the steepest local decrease.”</p></div><div class="field"><label for="claim-context">What should your explanation cover?</label><textarea id="claim-context" name="context" maxlength="600"></textarea></div>${map.claims.length ? `<fieldset><legend>What must be understood first?</legend><div class="check-list">${map.claims.map((claim) => `<label class="check-option"><input type="checkbox" name="prerequisite" value="${escapeHtml(claim.id)}"><span>${escapeHtml(claim.title)}</span></label>`).join('')}</div></fieldset>` : ''}<div class="button-row"><button class="button primary" type="submit">Pin this claim</button><button class="button quiet" type="button" data-close>Cancel</button></div></form>`}
  </div></dialog>`;
}

function rehearsalDialog(): string {
  const claim = map.claims.find((item) => item.id === selectedClaimId);
  if (!claim) return '<dialog id="rehearsal-dialog"></dialog>';
  return `<dialog id="rehearsal-dialog" aria-labelledby="rehearsal-title"><div class="dialog-paper"><div class="dialog-head"><div><p class="eyebrow">90-second teach-back</p><h2 id="rehearsal-title">${escapeHtml(claim.title)}</h2><p class="muted">This is a self-assessment, not an objective score.</p></div><button class="close-button" type="button" data-close aria-label="Close">×</button></div>
    <form id="rehearsal-form"><div id="rehearsal-errors" class="error-box" role="alert"></div><div class="timer-row"><div><span class="timer" id="timer" role="timer" aria-live="off">01:30</span><div class="microcopy" id="timer-note">Ready when you are. Notes stay closed.</div></div><button class="button" id="timer-toggle" type="button">Start 90 seconds</button></div>
    <div class="field"><label for="teach-back">Teach it back from memory <span aria-hidden="true">*</span></label><textarea id="teach-back" maxlength="5000" required aria-describedby="teach-hint">${escapeHtml(claim.teachBack)}</textarea><p class="field-hint" id="teach-hint">What is it, why does it work, and how would you show it?</p></div>
    <div class="field"><label for="counterexample">Counterexample or boundary</label><textarea id="counterexample" maxlength="2000" aria-describedby="counter-hint">${escapeHtml(claim.counterexample)}</textarea><p class="field-hint" id="counter-hint">When would the claim fail, change, or stop applying? Required for “can explain.”</p></div>
    <fieldset class="rehearsal-step"><legend>What can you produce right now?</legend><div class="status-choices">${(['explain', 'recognize', 'blocked'] as ClaimStatus[]).map((status) => `<div class="status-choice"><input id="status-${status}" name="status" type="radio" value="${status}" ${claim.status === status ? 'checked' : ''}><label for="status-${status}"><strong>${statusLabel(status)}</strong><small>${status === 'explain' ? 'I can teach and bound it.' : status === 'recognize' ? 'It feels familiar, but I stall.' : 'A missing piece stops me.'}</small></label></div>`).join('')}</div></fieldset>
    <div class="field"><label for="next-probe">Next probe <span aria-hidden="true">*</span></label><textarea id="next-probe" maxlength="1000" aria-describedby="probe-hint">${escapeHtml(claim.nextProbe)}</textarea><p class="field-hint" id="probe-hint">A question, example, or prerequisite to try next—not “read more.”</p></div>
    <div class="button-row"><button class="button primary" type="submit">Save self-assessment</button><button class="button quiet" id="edit-claim" type="button">Edit claim</button><button class="button danger" id="delete-claim" type="button">Remove claim</button></div></form>
    ${claim.rehearsals.length ? `<section class="history" aria-labelledby="history-title"><h3 id="history-title">Rehearsal history ${isUnlocked() ? '' : '<span class="microcopy">· latest shown on free</span>'}</h3>${(isUnlocked() ? [...claim.rehearsals].reverse() : [claim.rehearsals.at(-1)!]).map((item) => `<details><summary>${new Date(item.at).toLocaleDateString()} · ${statusLabel(item.status)}</summary><p><strong>Teach-back:</strong> ${escapeHtml(item.teachBack)}</p>${item.counterexample ? `<p><strong>Boundary:</strong> ${escapeHtml(item.counterexample)}</p>` : ''}<p><strong>Next:</strong> ${escapeHtml(item.nextProbe)}</p></details>`).join('')}</section>` : ''}
  </div></dialog>`;
}

function exportDialog(): string {
  return `<dialog id="export-dialog" aria-labelledby="export-title"><div class="dialog-paper"><div class="dialog-head"><div><p class="eyebrow">Your data, your way</p><h2 id="export-title">Export or import</h2><p class="muted">JSON keeps the full map and can be restored here. CSV makes a readable table.</p></div><button class="close-button" type="button" data-close aria-label="Close">×</button></div><div id="import-errors" class="error-box" role="alert"></div><div class="button-row"><button class="button primary" id="export-json" type="button">Download JSON</button><button class="button" id="export-csv" type="button">Download CSV</button><label class="button quiet" for="import-file">Import JSON</label><input class="visually-hidden" id="import-file" type="file" accept="application/json,.json"></div><p class="field-hint">Import replaces the map after you confirm. Export is never behind the paid unlock.</p></div></dialog>`;
}

function upgradePage(): string {
  return layout(`<main class="site-main" id="main"><section class="legal"><p class="eyebrow">One-time unlock</p><h1>Keep a larger workshop.</h1><p class="lede">The free map is complete for a focused topic. Studio is for learners who want to keep growing one private map without pruning it.</p></section><section class="upgrade-sheet">
    <div><h2>${isUnlocked() ? 'Studio is unlocked' : 'Lifetime studio'}</h2><p class="price">$12 USD <span class="microcopy">one time</span></p><ul><li>Unlimited claim slips (free includes ${FREE_CLAIM_LIMIT})</li><li>Full rehearsal history for every claim</li><li>All future local-first workshop additions</li></ul><p class="microcopy">Core JSON/CSV export, accessibility, privacy, and the complete rehearsal flow always stay free.</p>${isUnlocked() ? '<p class="license-note">This browser has an active Studio license.</p>' : `<a class="button primary" href="${CHECKOUT_URL}">Buy lifetime studio</a>`}</div>
    <form class="restore-form" id="restore-form"><h2>Restore a purchase</h2><p>Paste the license token from your receipt or another device.</p><div id="license-errors" class="error-box" role="alert"></div><div class="field"><label for="license-token">License token</label><input id="license-token" name="license" type="text" autocomplete="off" spellcheck="false" value="${escapeHtml(licenseToken)}"></div><button class="button" type="submit">Verify and restore</button></form>
  </section><p class="microcopy merchant-note">Sociobot/Dodo is the merchant of record. Refunds are handled there and revoke the license. Read our <a href="/terms" data-route>terms</a> and <a href="/privacy" data-route>privacy notice</a>.</p></main>`);
}

function privacyPage(): string {
  return layout(`<main class="site-main legal" id="main"><p class="eyebrow">Plain-language policy</p><h1>Privacy</h1><p class="lede">Your knowledge map belongs in your browser, not in our database.</p><p><strong>Last updated:</strong> August 28, 2026</p><h2>What stays on your device</h2><p>Claims, prerequisites, teach-backs, counterexamples, assessments, topic name, theme choice, and your license token are stored in your browser’s local storage. We do not receive or sync this map. Exported files go only where you choose to save them.</p><h2>Purchase verification</h2><p>If you buy or restore Studio, this app sends the license token—not your map—to the Sociobot billing API at <code>api.sociobot.in</code> to check whether it is valid. The verification result is cached for up to one day. Sociobot/Dodo is the merchant of record and processes checkout information under its own merchant obligations.</p><h2>Analytics and imagery</h2><p>This app contains no behavioral analytics, advertising trackers, third-party fonts, or runtime CDN scripts. The paper landscape was generated specifically for this product with Azure OpenAI through the Param Factory; it depicts no real person and is not used to analyze your knowledge.</p><h2>Your controls</h2><p>Use Export to keep a portable copy. Clear this site’s browser storage to erase local data. Removing browser data cannot cancel or refund a purchase; contact the merchant using the details on your receipt for that.</p><h2>Contact</h2><p>For privacy questions, email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a>.</p></main>`);
}

function termsPage(): string {
  return layout(`<main class="site-main legal" id="main"><p class="eyebrow">Use agreement</p><h1>Terms</h1><p class="lede">A private thinking tool, not an authority on what you know.</p><p><strong>Last updated:</strong> August 28, 2026</p><h2>The service</h2><p>Knowledge Boundary Map lets you create a local map and record your own assessments. It does not fact-check claims, measure intelligence, certify expertise, or replace a teacher or professional advice. You are responsible for checking important information against reliable sources.</p><h2>Free use and lifetime Studio</h2><p>The free version includes up to ${FREE_CLAIM_LIMIT} claims per local map and complete rehearsal and export tools. A $12 USD one-time Studio purchase unlocks unlimited claims and full rehearsal history for the lifetime of this product. No subscription is created. Sociobot/Dodo is merchant of record; refund requests are handled there. A refunded or invalid license is automatically locked.</p><h2>Availability and data</h2><p>The app is provided “as is” without a promise of uninterrupted availability. Data is stored locally, so you should export backups. Clearing browser data, changing devices, or browser failures can remove the local map. A valid license token can be restored on another device.</p><h2>Acceptable use</h2><p>Do not interfere with the service, attempt to misuse purchase verification, or use the app unlawfully. The software is also available under its repository’s MIT license.</p><h2>Changes and contact</h2><p>Material changes will be reflected by the date above. Questions can be sent to <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></main>`);
}

function route(): void {
  closeTimer();
  const path = location.pathname.replace(/\/$/, '') || '/';
  if (path === '/privacy') app.innerHTML = privacyPage();
  else if (path === '/terms') app.innerHTML = termsPage();
  else if (path === '/upgrade') app.innerHTML = upgradePage();
  else app.innerHTML = map.claims.length ? mapPage() : heroPage();
  bindCommon();
  if (path === '/' && map.claims.length) bindMap();
  if (path === '/' && !map.claims.length) bindHero();
  if (path === '/upgrade') bindUpgrade();
  window.scrollTo(0, 0);
}

function navigate(path: string): void {
  history.pushState({}, '', path);
  route();
}

function bindCommon(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); navigate(new URL(link.href).pathname); }));
  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    safeSet(THEME_KEY, next);
    route();
  });
  bindDialogClosers();
  updateOnlineState();
}

function bindHero(): void {
  document.querySelector('#start-map')?.addEventListener('click', openClaimDialog);
  document.querySelector('#load-example')?.addEventListener('click', () => {
    const first = makeClaim('A correlation does not by itself show causation', 'Explain at least two reasons correlated variables can move together.');
    const second = makeClaim('A confounder can affect both measured variables', 'Give a concrete example and show the hidden path.');
    const third = makeClaim('Random assignment reduces systematic confounding', 'Explain what random assignment does and does not guarantee.', [first.id, second.id]);
    map = { version: 1, topic: 'Causal inference basics', claims: [first, second, third] };
    saveMap(); route(); showToast('Example map added. Start by rehearsing any claim.');
  });
  bindClaimForm();
}

function bindMap(): void {
  document.querySelector('#topic')?.addEventListener('input', (event) => { map.topic = (event.target as HTMLInputElement).value; saveMap(); });
  document.querySelector('#new-claim')?.addEventListener('click', openClaimDialog);
  document.querySelector('#empty-add')?.addEventListener('click', openClaimDialog);
  document.querySelector('#export-menu')?.addEventListener('click', () => openDialog('export-dialog'));
  document.querySelectorAll<HTMLElement>('[data-rehearse]').forEach((button) => button.addEventListener('click', () => openRehearsal(button.dataset.rehearse!)));
  document.querySelectorAll<HTMLButtonElement>('[data-claim-id]').forEach((button) => {
    button.addEventListener('click', () => openRehearsal(button.dataset.claimId!));
    button.addEventListener('keydown', handleMapKeys);
  });
  bindClaimForm(); bindRehearsalForm(); bindExport(); drawConnections();
}

function bindDialogClosers(): void {
  document.querySelectorAll<HTMLDialogElement>('dialog').forEach((dialog) => {
    dialog.querySelectorAll<HTMLElement>('[data-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => closeTimer());
  });
}

function openDialog(id: string): void {
  const dialog = document.querySelector<HTMLDialogElement>(`#${id}`);
  if (dialog && !dialog.open) dialog.showModal();
}

function openClaimDialog(): void {
  if (map.claims.length >= FREE_CLAIM_LIMIT && !isUnlocked()) { openDialog('claim-dialog'); return; }
  openDialog('claim-dialog');
  setTimeout(() => document.querySelector<HTMLInputElement>('#claim-title')?.focus(), 0);
}

function bindClaimForm(): void {
  document.querySelector<HTMLFormElement>('#claim-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const title = String(data.get('title') ?? '').trim();
    if (!title) { setErrors('claim-errors', ['Write a claim before pinning it.']); return; }
    const prerequisites = data.getAll('prerequisite').map(String);
    map.claims.push(makeClaim(title, String(data.get('context') ?? ''), prerequisites));
    saveMap(); (form.closest('dialog') as HTMLDialogElement).close(); route(); showToast('Claim pinned.');
  });
}

function openRehearsal(id: string): void {
  selectedClaimId = id;
  route();
  openDialog('rehearsal-dialog');
  setTimeout(() => document.querySelector<HTMLButtonElement>('#timer-toggle')?.focus(), 0);
}

function bindRehearsalForm(): void {
  const form = document.querySelector<HTMLFormElement>('#rehearsal-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = new FormData(form).get('status') as ClaimStatus | null;
    const teachBack = document.querySelector<HTMLTextAreaElement>('#teach-back')!.value;
    const counterexample = document.querySelector<HTMLTextAreaElement>('#counterexample')!.value;
    const nextProbe = document.querySelector<HTMLTextAreaElement>('#next-probe')!.value;
    const errors = status ? validateRehearsal(status, teachBack, counterexample, nextProbe) : ['Choose the boundary that matches what you produced.'];
    if (errors.length) { setErrors('rehearsal-errors', errors); return; }
    const index = map.claims.findIndex((claim) => claim.id === selectedClaimId);
    map.claims[index] = recordRehearsal(map.claims[index], status!, teachBack, counterexample, nextProbe);
    saveMap(); closeTimer(); (form.closest('dialog') as HTMLDialogElement).close(); route(); showToast(`Saved as “${statusLabel(status!)}.”`);
  });
  document.querySelector('#timer-toggle')?.addEventListener('click', toggleTimer);
  document.querySelector('#delete-claim')?.addEventListener('click', removeSelected);
  document.querySelector('#edit-claim')?.addEventListener('click', editSelected);
}

function toggleTimer(): void {
  const button = document.querySelector<HTMLButtonElement>('#timer-toggle')!;
  if (timerId) { window.clearInterval(timerId); timerId = 0; button.textContent = 'Resume timer'; return; }
  if (secondsLeft === 0) secondsLeft = 90;
  button.textContent = 'Pause timer';
  document.querySelector('#timer-note')!.textContent = 'Explain aloud or write below. Looking up comes after.';
  timerId = window.setInterval(() => {
    secondsLeft -= 1; updateTimer();
    if (secondsLeft <= 0) { closeTimer(false); button.textContent = 'Restart 90 seconds'; document.querySelector('#timer-note')!.textContent = 'Time. Capture what came easily and where you stalled.'; announce('Teach-back time is complete.'); }
  }, 1000);
}

function updateTimer(): void {
  const timer = document.querySelector('#timer');
  if (timer) timer.textContent = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
}

function closeTimer(reset = true): void {
  if (timerId) window.clearInterval(timerId);
  timerId = 0;
  if (reset) secondsLeft = 90;
}

function editSelected(): void {
  const claim = map.claims.find((item) => item.id === selectedClaimId);
  if (!claim) return;
  const nextTitle = window.prompt('Edit the claim', claim.title)?.trim();
  if (!nextTitle) return;
  claim.title = nextTitle.slice(0, 160); claim.updatedAt = new Date().toISOString(); saveMap();
  document.querySelector<HTMLDialogElement>('#rehearsal-dialog')?.close(); route(); showToast('Claim updated.');
}

function removeSelected(): void {
  const index = map.claims.findIndex((claim) => claim.id === selectedClaimId);
  const claim = map.claims[index];
  if (!claim || !window.confirm(`Remove “${claim.title}”? Claims that depend on it will keep working but lose that connection.`)) return;
  lastRemoved = { claim, index, dependentIds: map.claims.filter((item) => item.prerequisiteIds.includes(claim.id)).map((item) => item.id) };
  map.claims.splice(index, 1); map.claims.forEach((item) => item.prerequisiteIds = item.prerequisiteIds.filter((id) => id !== claim.id)); saveMap();
  document.querySelector<HTMLDialogElement>('#rehearsal-dialog')?.close(); selectedClaimId = ''; route(); showToast('Claim removed.', 'Undo', undoRemove);
}

function undoRemove(): void {
  if (!lastRemoved) return;
  map.claims.splice(lastRemoved.index, 0, lastRemoved.claim);
  map.claims.forEach((item) => { if (lastRemoved!.dependentIds.includes(item.id)) item.prerequisiteIds.push(lastRemoved!.claim.id); });
  saveMap(); lastRemoved = null; route(); showToast('Claim and its connections restored.');
}

function bindExport(): void {
  document.querySelector('#export-json')?.addEventListener('click', () => download(`knowledge-boundary-map-${dateStamp()}.json`, JSON.stringify(map, null, 2), 'application/json'));
  document.querySelector('#export-csv')?.addEventListener('click', () => download(`knowledge-boundary-map-${dateStamp()}.csv`, asCsv(map), 'text/csv'));
  document.querySelector<HTMLInputElement>('#import-file')?.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const incoming = sanitizeMap(JSON.parse(await file.text()));
      if (!window.confirm(`Replace this map with “${incoming.topic || 'Untitled topic'}” and its ${incoming.claims.length} claims? Export first if you need a backup.`)) return;
      map = incoming; saveMap(); document.querySelector<HTMLDialogElement>('#export-dialog')?.close(); route(); showToast('Map imported.');
    } catch (error) {
      const message = error instanceof SyntaxError
        ? 'This file is not valid JSON. Choose a Knowledge Boundary Map JSON export and try again.'
        : error instanceof Error
          ? error.message
          : 'This file could not be read. Choose a Knowledge Boundary Map JSON export and try again.';
      setErrors('import-errors', [message]);
    }
  });
}

function download(filename: string, body: string, type: string): void {
  const url = URL.createObjectURL(new Blob([body], { type: `${type};charset=utf-8` }));
  const link = Object.assign(document.createElement('a'), { href: url, download: filename }); link.click(); URL.revokeObjectURL(url); showToast(`${filename.endsWith('.csv') ? 'CSV' : 'JSON'} exported.`);
}

function dateStamp(): string { return new Date().toISOString().slice(0, 10); }

function handleMapKeys(event: KeyboardEvent): void {
  if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-claim-id]')];
  const current = buttons.indexOf(event.currentTarget as HTMLButtonElement);
  let next = current;
  if (event.key === 'Home') next = 0; else if (event.key === 'End') next = buttons.length - 1; else next = (current + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
  buttons.forEach((button, index) => button.tabIndex = index === next ? 0 : -1); buttons[next].focus();
}

function drawConnections(): void {
  const canvas = document.querySelector<HTMLElement>('#map-canvas');
  const svg = document.querySelector<SVGSVGElement>('#map-links');
  if (!canvas || !svg) return;
  const canvasBox = canvas.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${canvasBox.width} ${canvasBox.height}`);
  svg.innerHTML = map.claims.flatMap((claim) => claim.prerequisiteIds.map((prerequisiteId) => {
    const from = document.querySelector<HTMLElement>(`[data-node="${CSS.escape(prerequisiteId)}"]`)?.getBoundingClientRect();
    const to = document.querySelector<HTMLElement>(`[data-node="${CSS.escape(claim.id)}"]`)?.getBoundingClientRect();
    if (!from || !to) return '';
    const x1 = from.left - canvasBox.left + from.width / 2, y1 = from.top - canvasBox.top + from.height / 2;
    const x2 = to.left - canvasBox.left + to.width / 2, y2 = to.top - canvasBox.top + to.height / 2;
    return `<path d="M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}"/>`;
  })).join('');
}

function bindUpgrade(): void {
  document.querySelector<HTMLFormElement>('#restore-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const token = String(new FormData(form).get('license') ?? '').trim();
    if (!token) { setErrors('license-errors', ['Paste the license token from your receipt.']); return; }
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!; submit.disabled = true; submit.textContent = 'Checking…';
    const valid = await verifyLicense(token, true);
    if (valid) { licenseToken = token; safeSet(LICENSE_KEY, token); route(); showToast('Studio restored on this browser.'); }
    else { setErrors('license-errors', [navigator.onLine ? 'That license is not active for this product. Check the token and try again.' : 'You appear to be offline. Connect and try restoring again.']); submit.disabled = false; submit.textContent = 'Verify and restore'; }
  });
}

async function verifyLicense(token: string, force = false): Promise<boolean> {
  if (!force && licenseVerdict && Date.now() - licenseVerdict.checkedAt < 86_400_000) return licenseVerdict.valid;
  try {
    const response = await fetch(`${BILLING_BASE}/api/v1/products/knowledge-boundary-map/verify?license=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } });
    const result = await response.json() as { valid?: boolean; reason?: string };
    licenseVerdict = { valid: response.ok && result.valid === true, reason: result.reason, checkedAt: Date.now() };
    safeSet(VERDICT_KEY, JSON.stringify(licenseVerdict)); return licenseVerdict.valid;
  } catch { return Boolean(licenseVerdict?.valid); }
}

function setErrors(id: string, errors: string[]): void {
  const box = document.querySelector<HTMLElement>(`#${id}`);
  if (box) { box.innerHTML = `<ul>${errors.map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul>`; box.focus(); }
}

function showToast(message: string, action = '', handler?: () => void): void {
  const toast = document.querySelector<HTMLElement>('#toast');
  if (!toast) return;
  document.querySelector('#toast-message')!.textContent = message;
  const button = document.querySelector<HTMLButtonElement>('#toast-action')!; button.textContent = action; button.hidden = !action; button.onclick = handler ?? null;
  toast.classList.add('visible'); window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 6000);
}

function announce(message: string): void { showToast(message); }
function updateOnlineState(): void { document.querySelector('.offline-banner')?.classList.toggle('visible', !navigator.onLine); }

function applyTheme(): void {
  const stored = safeGet(THEME_KEY);
  const theme = stored === 'dark' || stored === 'light' ? stored : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.dataset.theme = theme;
}

async function initializeLicense(): Promise<void> {
  const params = new URLSearchParams(location.search);
  const incoming = params.get('license');
  if (incoming) {
    licenseToken = incoming; safeSet(LICENSE_KEY, incoming); params.delete('license');
    history.replaceState({}, '', `${location.pathname}${params.size ? `?${params}` : ''}${location.hash}`);
    licenseVerdict = { valid: true, checkedAt: 0 }; safeSet(VERDICT_KEY, JSON.stringify(licenseVerdict));
  }
  if (licenseToken) { const before = isUnlocked(); await verifyLicense(licenseToken); if (before !== isUnlocked()) route(); }
}

window.addEventListener('popstate', route);
window.addEventListener('online', () => { updateOnlineState(); if (licenseToken) void verifyLicense(licenseToken, true); });
window.addEventListener('offline', updateOnlineState);
window.addEventListener('resize', () => requestAnimationFrame(drawConnections));
document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  if (event.key.toLowerCase() === 'n' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) && !document.querySelector('dialog[open]') && location.pathname === '/') { event.preventDefault(); openClaimDialog(); }
});

applyTheme(); route(); void initializeLicense();
if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
