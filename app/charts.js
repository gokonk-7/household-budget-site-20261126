// Charts drawn as plain SVG, built by hand — no library, no network, and
// every number in them comes from the store, so a chart can never disagree
// with the ledger.

import { moneyWhole } from './format.js';

// Horizontal bars: one row per item, label on the left, value on the right.
export function barChart(rows, opts = {}) {
  const width = opts.width || 560;
  const rowH = 34;
  const labelW = 150;
  const valueW = 64;
  const height = rows.length * rowH + 8;
  const max = Math.max(...rows.map((r) => r.value), 1);
  const inner = width - labelW - valueW;
  const bars = rows
    .map((r, i) => {
      const y = 8 + i * rowH;
      const w = Math.max(2, (r.value / max) * inner);
      return (
        '<text x="0" y="' + (y + 15) + '" class="chart-label">' + r.label + '</text>' +
        '<rect x="' + labelW + '" y="' + y + '" width="' + w.toFixed(1) + '" height="20" rx="4" fill="' + (r.colour || '#2e6b4f') + '"/>' +
        '<text x="' + (labelW + w + 8) + '" y="' + (y + 15) + '" class="chart-value">' + moneyWhole(r.value) + '</text>'
      );
    })
    .join('');
  return '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Bar chart: ' + rows.map((r) => r.label + ' ' + moneyWhole(r.value)).join(', ') + '">' + bars + '</svg>';
}

// A simple line chart: income as a line, spending as bars, one month per step.
export function trendChart(months) {
  const width = 560;
  const height = 220;
  const padL = 44;
  const padB = 28;
  const padT = 14;
  const innerW = width - padL - 16;
  const innerH = height - padT - padB;
  const max = Math.max(...months.flatMap((m) => [m.spent, m.income]), 1) * 1.05;
  const x = (i) => padL + (i * innerW) / (months.length - 1);
  const y = (v) => padT + innerH - (v / max) * innerH;
  const bars = months
    .map((m, i) => '<rect x="' + (x(i) - 14) + '" y="' + y(m.spent) + '" width="28" height="' + (padT + innerH - y(m.spent)) + '" rx="3" fill="#b4552d" opacity="0.85"/>')
    .join('');
  const line = months.map((m, i) => (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(m.income).toFixed(1)).join(' ');
  const dots = months
    .map((m, i) => '<circle cx="' + x(i) + '" cy="' + y(m.income) + '" r="4" fill="#2e6b4f"/>')
    .join('');
  const labels = months
    .map((m, i) => '<text x="' + x(i) + '" y="' + (height - 8) + '" class="chart-label chart-centre">' + m.month + '</text>')
    .join('');
  const grid = [0.25, 0.5, 0.75, 1]
    .map((f) => {
      const gy = padT + innerH - f * innerH;
      return '<line x1="' + padL + '" y1="' + gy + '" x2="' + (width - 16) + '" y2="' + gy + '" class="chart-grid"/><text x="' + (padL - 6) + '" y="' + (gy + 4) + '" class="chart-label chart-right">' + moneyWhole(max * f) + '</text>';
    })
    .join('');
  return (
    '<svg viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="Six month trend: spending bars against the income line">' +
    grid + bars +
    '<path d="' + line + '" fill="none" stroke="#2e6b4f" stroke-width="2.5"/>' + dots + labels +
    '</svg>'
  );
}

// A donut: one arc per slice, with a hole in the middle for the total.
export function donutChart(slices, totalLabel) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 78;
  const thick = 34;
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let angle = -Math.PI / 2;
  const arcs = slices
    .map((s) => {
      const frac = s.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      return '<path d="M ' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + '" fill="none" stroke="' + s.colour + '" stroke-width="' + thick + '"/>';
    })
    .join('');
  return (
    '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Spending split by person">' +
    arcs +
    '<text x="' + cx + '" y="' + (cy - 4) + '" class="chart-donut-total">' + totalLabel + '</text>' +
    '<text x="' + cx + '" y="' + (cy + 16) + '" class="chart-label chart-centre">spent in Nov</text>' +
    '</svg>'
  );
}
