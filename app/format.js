// Small formatting helpers, one job: make money and dates read like a person
// would say them at the kitchen table.

// $1,234.56 — always two decimals, always a dollar sign, never a bare number.
export function money(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

// $1,235 — whole dollars, for big headline figures.
export function moneyWhole(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

// 2026-11-26 -> "Thu 26 Nov"
export function shortDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

// 2026-11-26 -> "26 November 2026"
export function longDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// "3 days ago" for a last-used date, measured against the household's today.
export function daysAgo(iso, todayIso) {
  const a = new Date(iso + 'T12:00:00');
  const b = new Date(todayIso + 'T12:00:00');
  const days = Math.round((b - a) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return days + ' days ago';
  const months = Math.round(days / 30);
  return months + (months === 1 ? ' month ago' : ' months ago');
}

// Escape text before it goes into innerHTML, so a label can never break the page.
export function esc(text) {
  return String(text ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
