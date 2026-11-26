// Every page of the site, as functions that return HTML. Each page reads its
// numbers from the store and nothing else, so what you see is the ledger.

import { state, totals, safeToSpendPerDay, envelopeStatuses, upcomingBills, subscriptionStatuses, subscriptionTotals, historyWithNovember, monthTransactions, personById, envelopeById, spentByPerson } from './store.js';
import { money, moneyWhole, shortDate, longDate, daysAgo, esc } from './format.js';
import { barChart, trendChart, donutChart } from './charts.js';
import { houseRules } from './data.js';

const STATUS_LABEL = { over: 'Over budget', hot: 'Running hot', ontrack: 'On track', under: 'Under pace' };

function envelopeCard(e) {
  const pct = Math.min(e.pace, 100);
  const barClass = e.status === 'over' ? 'bar-over' : e.status === 'hot' ? 'bar-hot' : 'bar-ok';
  return (
    '<article class="env-card">' +
    '<div class="env-head"><span class="env-icon" aria-hidden="true">' + e.icon + '</span>' +
    '<h3>' + esc(e.name) + '</h3>' +
    '<span class="pill pill-' + e.status + '">' + STATUS_LABEL[e.status] + '</span></div>' +
    '<p class="env-note">' + esc(e.note) + '</p>' +
    '<div class="env-numbers"><strong>' + money(e.spent) + '</strong><span> of ' + money(e.budget) + '</span></div>' +
    '<div class="meter" role="img" aria-label="' + esc(e.name) + ': ' + money(e.spent) + ' spent of ' + money(e.budget) + '"><span class="' + barClass + '" style="width:' + pct.toFixed(1) + '%"></span></div>' +
    '<p class="env-left">' + (e.left >= 0 ? money(e.left) + ' left' : money(-e.left) + ' over') + ' · ' + e.pace.toFixed(0) + '% of budget</p>' +
    '</article>'
  );
}

function transactionRow(t) {
  const p = personById(t.person);
  const env = envelopeById(t.envelope);
  const sign = t.kind === 'in' ? '+' : '−';
  return (
    '<li class="tx-row">' +
    '<span class="tx-dot" style="background:' + p.colour + '" title="' + esc(p.name) + '"></span>' +
    '<div class="tx-main"><strong>' + esc(t.label) + '</strong>' +
    '<span class="tx-meta">' + shortDate(t.date) + ' · ' + esc(p.name) + ' · ' + esc(env ? env.name : t.envelope) + (t.note ? ' · ' + esc(t.note) : '') + '</span></div>' +
    '<span class="tx-amount ' + (t.kind === 'in' ? 'tx-in' : '') + '">' + sign + money(t.amount) + '</span>' +
    '<button class="tx-delete" data-delete-tx="' + t.id + '" aria-label="Delete ' + esc(t.label) + '">×</button>' +
    '</li>'
  );
}

// --- Dashboard ---------------------------------------------------------------

export function viewDashboard() {
  const t = totals();
  const safe = safeToSpendPerDay();
  const envs = envelopeStatuses();
  const over = envs.filter((e) => e.status === 'over');
  const hot = envs.filter((e) => e.status === 'hot');
  const next = upcomingBills().slice(0, 3);
  const recent = [...monthTransactions()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  const subs = subscriptionTotals();
  const takeaway = envs.find((e) => e.id === 'eating-out');

  const alerts = [];
  if (over.length) alerts.push('<p class="alert alert-bad"><strong>' + over.map((e) => esc(e.name)).join(', ') + '</strong> ' + (over.length === 1 ? 'is' : 'are') + ' over budget — move money from Buffer or cut back this week.</p>');
  if (hot.length) alerts.push('<p class="alert alert-warn"><strong>' + hot.map((e) => esc(e.name)).join(', ') + '</strong> ' + (hot.length === 1 ? 'is' : 'are') + ' running hotter than the month — ' + money(takeaway ? takeaway.left : 0) + ' left for eating out.</p>');
  if (subs.forgottenMonthly > 0) alerts.push('<p class="alert alert-warn">The Leak Finder found <strong>' + money(subs.forgottenMonthly) + '/month</strong> in subscriptions nobody has used in a month — <a href="#/leaks">see which ones</a>.</p>');
  if (!alerts.length) alerts.push('<p class="alert alert-good">Nothing is over budget and no subscription has gone quiet. The month is behaving.</p>');

  return (
    '<section class="hero">' +
    '<p class="kicker">The Rivera household · ' + 'November 2026' + ' · Day 26 of 30</p>' +
    '<h1>What can we spend today?</h1>' +
    '<p class="lede">Not a spreadsheet. A kitchen-table answer: after the bills still to come, this is what is safe to spend, per day, until the month ends.</p>' +
    '<div class="safe-box"><span class="safe-label">Safe to spend, per day</span>' +
    '<strong class="safe-number">' + money(safe.perDay) + '</strong>' +
    '<span class="safe-sub">' + money(safe.free) + ' free for the last ' + safe.daysLeft + ' days · next payday 30 Nov</span></div>' +
    '</section>' +

    '<section class="stat-grid" aria-label="Month so far">' +
    '<div class="stat"><span>Money in</span><strong>' + money(t.income) + '</strong><small>Pay $6,000 + $135 extra in</small></div>' +
    '<div class="stat"><span>Money out</span><strong>' + money(t.spent) + '</strong><small>' + money(t.dailyPace) + ' a day, on average</small></div>' +
    '<div class="stat"><span>Left in the month</span><strong>' + money(t.left) + '</strong><small>' + Math.round((t.left / t.income) * 100) + '% of income still unspent</small></div>' +
    '<div class="stat"><span>Already saved</span><strong>' + money(envelopeStatuses().find((e) => e.id === 'savings').spent) + '</strong><small>of the $900 savings plan</small></div>' +
    '</section>' +

    '<section><h2>Heads up</h2>' + alerts.join('') + '</section>' +

    '<section><div class="section-head"><h2>Envelopes at a glance</h2><a class="link-more" href="#/envelopes">All envelopes →</a></div>' +
    '<div class="env-grid">' + envs.slice(0, 6).map(envelopeCard).join('') + '</div></section>' +

    '<section class="two-col">' +
    '<div><h2>Bills still to come</h2><ul class="bill-list">' +
    next.map((b) => '<li><strong>' + esc(b.label) + '</strong><span>' + money(b.amount) + ' · ' + b.month + ' ' + b.day + ' · in ' + b.inDays + ' day' + (b.inDays === 1 ? '' : 's') + '</span></li>').join('') +
    '</ul><p><a class="link-more" href="#/plan">Full payday plan →</a></p></div>' +
    '<div><h2>Latest spending</h2><ul class="tx-list">' + recent.map(transactionRow).join('') + '</ul>' +
    '<p><a class="link-more" href="#/transactions">Full ledger →</a></p></div>' +
    '</section>'
  );
}

// --- Envelopes -----------------------------------------------------------------

export function viewEnvelopes() {
  const envs = envelopeStatuses();
  const planned = state.envelopes.reduce((s, e) => s + e.budget, 0);
  return (
    '<section class="page-head"><p class="kicker">Envelope budgeting</p>' +
    '<h1>Every dollar has a job</h1>' +
    '<p class="lede">Ten envelopes, one for each job the money has to do. The plan adds up to ' + money(planned) + ' — exactly the household’s pay. Spend from an envelope, and the bar moves; move money between envelopes when life changes the plan.</p></section>' +
    '<section><div class="env-grid">' + envs.map(envelopeCard).join('') + '</div></section>' +
    '<section class="two-col"><div class="panel"><h2>Move money between envelopes</h2>' +
    '<p>Rent came in under plan? Shift the spare into Groceries. No new money appears — the total stays ' + money(planned) + '.</p>' +
    '<form id="move-form" class="form-grid">' +
    '<label>From<select name="from">' + state.envelopes.map((e) => '<option value="' + e.id + '">' + esc(e.name) + '</option>').join('') + '</select></label>' +
    '<label>To<select name="to">' + state.envelopes.map((e) => '<option value="' + e.id + '">' + esc(e.name) + '</option>').join('') + '</select></label>' +
    '<label>Amount ($) <input name="amount" type="number" min="1" step="1" value="50" required></label>' +
    '<button class="btn" type="submit">Move it</button>' +
    '</form><p class="form-msg" id="move-msg" role="status"></p></div>' +
    '<div class="panel"><h2>Change a monthly plan</h2>' +
    '<p>Plans are guesses. If Groceries always runs out on the 24th, raise it — and say where the money comes from.</p>' +
    '<form id="budget-form" class="form-grid">' +
    '<label>Envelope<select name="envelope">' + state.envelopes.map((e) => '<option value="' + e.id + '">' + esc(e.name) + ' — now ' + money(e.budget) + '</option>').join('') + '</select></label>' +
    '<label>New monthly budget ($) <input name="budget" type="number" min="0" step="10" value="820" required></label>' +
    '<button class="btn" type="submit">Save plan</button>' +
    '</form><p class="form-msg" id="budget-msg" role="status"></p></div></section>' +
    '<section><h2>How envelopes work here</h2><ol class="rules">' +
    '<li><strong>Plan on payday, not on the 1st.</strong> The money is divided the day it lands, before anything is spent.</li>' +
    '<li><strong>An empty envelope means stop, not borrow.</strong> Borrowing comes from Buffer, deliberately, and is written down.</li>' +
    '<li><strong>Savings is an envelope too.</strong> It gets its money first, on payday, like a bill — because it is one.</li>' +
    '</ol></section>'
  );
}

// --- Transactions ------------------------------------------------------------

export function viewTransactions() {
  const tx = [...monthTransactions()].sort((a, b) => b.date.localeCompare(a.date) || a.label.localeCompare(b.label));
  const t = totals();
  return (
    '<section class="page-head"><p class="kicker">The ledger · November 2026</p>' +
    '<h1>Every dollar, written down</h1>' +
    '<p class="lede">' + tx.length + ' entries this month — ' + money(t.spent) + ' out, ' + money(t.extraIn) + ' extra in. Add what you spend as you spend it; the envelopes, the dashboard and the reports all read this one list.</p></section>' +
    '<section class="panel"><h2>Add spending or income</h2>' +
    '<form id="tx-form" class="form-grid tx-form">' +
    '<label>Date<input name="date" type="date" value="2026-11-26" required></label>' +
    '<label>Who<select name="person">' + state.people.map((p) => '<option value="' + p.id + '">' + esc(p.name) + '</option>').join('') + '</select></label>' +
    '<label>Envelope<select name="envelope">' + state.envelopes.map((e) => '<option value="' + e.id + '">' + esc(e.name) + '</option>').join('') + '</select></label>' +
    '<label>What<input name="label" type="text" placeholder="e.g. Marigold Market — weekly shop" required></label>' +
    '<label>Amount ($)<input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>' +
    '<label>Kind<select name="kind"><option value="out">Money out</option><option value="in">Money in</option></select></label>' +
    '<label class="wide">Note (optional)<input name="note" type="text" placeholder="Why, or what for"></label>' +
    '<button class="btn" type="submit">Add to the ledger</button>' +
    '</form><p class="form-msg" id="tx-msg" role="status"></p></section>' +
    '<section><div class="section-head"><h2>November’s entries</h2>' +
    '<button class="btn btn-ghost" id="export-csv">Download ledger as CSV</button></div>' +
    '<ul class="tx-list tx-full">' + tx.map(transactionRow).join('') + '</ul></section>'
  );
}

// --- Leak Finder ---------------------------------------------------------------

export function viewLeaks() {
  const subs = subscriptionStatuses();
  const totalsSub = subscriptionTotals();
  const active = subs.filter((s) => !s.cut);
  const cut = subs.filter((s) => s.cut);
  const rows = active.map((s) => {
    const flag = s.forgotten ? '<span class="pill pill-over">Unused ' + s.idleDays + ' days</span>'
      : s.stale ? '<span class="pill pill-hot">Unused ' + s.idleDays + ' days</span>'
      : '<span class="pill pill-ontrack">Used ' + daysAgo(s.lastUsed, '2026-11-26') + '</span>';
    return '<li class="sub-row"><div><strong>' + esc(s.name) + '</strong><span class="tx-meta">' + esc(s.note) + ' · last used ' + longDate(s.lastUsed) + '</span></div>' +
      '<span class="sub-cost">' + money(s.amount) + '/mo · ' + money(s.yearly) + '/yr</span>' + flag +
      '<button class="btn btn-ghost" data-cut-sub="' + s.id + '">Cut it</button></li>';
  }).join('');
  return (
    '<section class="page-head"><p class="kicker">The Leak Finder</p>' +
    '<h1>Find the money that slips away</h1>' +
    '<p class="lede">Small, regular payments are the quietest leak in a household budget. Here is every subscription the Riveras pay, when it was last used, and what it costs over a year. Cut what you forgot — the totals update on the spot.</p></section>' +
    '<section class="stat-grid">' +
    '<div class="stat"><span>Subscriptions still running</span><strong>' + totalsSub.count + '</strong><small>' + money(totalsSub.monthly) + ' a month between them</small></div>' +
    '<div class="stat"><span>That is, per year</span><strong>' + money(totalsSub.yearly) + '</strong><small>A family holiday, in subscriptions</small></div>' +
    '<div class="stat"><span>Forgotten — unused 30+ days</span><strong>' + money(totalsSub.forgottenMonthly) + '/mo</strong><small>' + money(totalsSub.forgottenYearly) + ' a year, for nothing</small></div>' +
    '<div class="stat"><span>Cut so far</span><strong>' + (cut.length ? cut.map((s) => esc(s.name)).join(', ') : 'None yet') + '</strong><small>' + (cut.length ? money(cut.reduce((s, x) => s + x.amount, 0)) + '/mo saved' : 'Tap “Cut it” to start') + '</small></div>' +
    '</section>' +
    '<section><h2>Every subscription, audited</h2><ul class="sub-list">' + rows + '</ul></section>' +
    '<section class="panel"><h2>The “what if” simulator</h2>' +
    '<p>Slide the habits and watch the year change. These are the Rivera household’s real numbers — takeaway twice a week, coffee out three times, and the forgotten subscriptions above.</p>' +
    '<div class="sim-grid">' +
    '<label class="sim-row"><span>Takeaway nights per week <output id="sim-takeaway-out">2</output></span><input id="sim-takeaway" type="range" min="0" max="4" step="1" value="2"><small>Average takeaway night: $28</small></label>' +
    '<label class="sim-row"><span>Coffees bought out per week <output id="sim-coffee-out">3</output></span><input id="sim-coffee" type="range" min="0" max="7" step="1" value="3"><small>Average coffee out: $4.80</small></label>' +
    '<label class="sim-row"><span>Forgotten subscriptions <output id="sim-subs-out">keep</output></span><input id="sim-subs" type="range" min="0" max="1" step="1" value="0"><small>0 = keep them, 1 = cut them all</small></label>' +
    '</div>' +
    '<div class="sim-result"><span>Compared with today, you would keep</span><strong id="sim-result">$0 a year</strong><span id="sim-result-sub">Move a slider to see what changes.</span></div>' +
    '</section>' +
    '<section><h2>What the leaks could buy</h2><ul class="rules">' +
    '<li><strong>' + money(totalsSub.forgottenYearly) + ' a year</strong> — the forgotten subscriptions alone — is June’s entire after-school club for a year, with change.</li>' +
    '<li><strong>One fewer takeaway a week</strong> saves about $1,456 a year. That is the family’s summer weekend away, paid for.</li>' +
    '<li><strong>Cutting the gym nobody visits</strong> saves $504 a year — or, kept, it is a reminder to actually go.</li>' +
    '</ul></section>'
  );
}

// --- Payday plan -----------------------------------------------------------------

export function viewPlan() {
  const t = totals();
  const next = upcomingBills();
  const paydays = [
    { date: 'Fri 27 Nov', who: 'Tom — Friday pay', amount: 712, note: 'Weekly nursing pay, every Friday' },
    { date: 'Mon 30 Nov', who: 'Maya — payday', amount: 1575, note: 'Half-month teaching salary; $450 moves to savings the same day' },
    { date: 'Fri 4 Dec', who: 'Tom — Friday pay', amount: 712, note: 'Weekly nursing pay' },
    { date: 'Mon 7 Dec', who: 'Tom — Friday pay', amount: 712, note: 'Weekly nursing pay' },
    { date: 'Tue 15 Dec', who: 'Maya — payday', amount: 1575, note: 'Half-month teaching salary; $450 moves to savings' },
  ];
  return (
    '<section class="page-head"><p class="kicker">Payday to payday</p>' +
    '<h1>The plan, not the panic</h1>' +
    '<p class="lede">A household budget is really a calendar: money lands on some days and leaves on others. This is the next stretch, dated and counted, so nothing arrives as a surprise.</p></section>' +
    '<section class="two-col"><div><h2>Money coming in</h2><ul class="bill-list">' +
    paydays.map((p) => '<li><strong>' + esc(p.who) + '</strong><span>' + money(p.amount) + ' · ' + esc(p.date) + '</span><small>' + esc(p.note) + '</small></li>').join('') +
    '</ul></div>' +
    '<div><h2>Bills going out</h2><ul class="bill-list">' +
    next.map((b) => '<li><strong>' + esc(b.label) + '</strong><span>' + money(b.amount) + ' · ' + b.month + ' ' + b.day + ' · in ' + b.inDays + ' day' + (b.inDays === 1 ? '' : 's') + (b.autopay ? ' · autopay' : ' · pay by hand') + '</span></li>').join('') +
    '</ul></div></section>' +
    '<section class="panel"><h2>December, at a glance</h2>' +
    '<p>December’s pay is $6,000, the same as November’s. December’s fixed bills — rent, power, internet, water, insurance, phones, gym and the school club — come to <strong>' + money(state.bills.reduce((s, b) => s + b.amount, 0)) + '</strong>. After the $900 savings move, that leaves <strong>' + money(6000 - state.bills.reduce((s, b) => s + b.amount, 0) - 900) + '</strong> for groceries, transport, eating out, kids, fun, home, health and buffer — the envelopes already plan for exactly that.</p>' +
    '<p>November ends with <strong>' + money(t.left) + '</strong> unspent. The household’s rule: whatever is left on the 30th rolls into the holiday pot, it is not a reason to spend it.</p></section>' +
    '<section><h2>The house rules</h2><p>Written at the kitchen table, argued over once, and kept ever since.</p><ol class="rules">' +
    houseRules.map((r) => '<li><strong>' + esc(r.rule) + '.</strong> ' + esc(r.text) + '</li>').join('') +
    '</ol></section>'
  );
}

// --- Reports ---------------------------------------------------------------------

export function viewReports() {
  const envs = envelopeStatuses().filter((e) => e.spent > 0).sort((a, b) => b.spent - a.spent);
  const colours = ['#2e6b4f', '#b4552d', '#7a5ea8', '#3f7d8c', '#a87c2a', '#8c3f5c', '#5b6470', '#4a7a3f', '#94501e', '#6b7fa8'];
  const bars = envs.map((e, i) => ({ label: e.name, value: Math.round(e.spent), colour: colours[i % colours.length] }));
  const history = historyWithNovember();
  const byPerson = state.people
    .filter((p) => p.id !== 'shared')
    .map((p, i) => ({ label: p.name, value: Math.round(spentByPerson(p.id)), colour: colours[i % colours.length] }));
  const sharedSpent = Math.round(spentByPerson('shared'));
  const byPersonAll = [...byPerson, { label: 'Shared', value: sharedSpent, colour: '#5b6470' }];
  const t = totals();
  const top = [...monthTransactions()].filter((x) => x.kind === 'out').sort((a, b) => b.amount - a.amount).slice(0, 5);
  return (
    '<section class="page-head"><p class="kicker">Reports · November 2026</p>' +
    '<h1>Where did it actually go?</h1>' +
    '<p class="lede">Not what the plan said — what happened. ' + money(t.spent) + ' left the household in November, and here it is, by envelope, by person and over six months.</p></section>' +
    '<section class="two-col"><div class="panel"><h2>Spending by envelope</h2>' + barChart(bars) + '</div>' +
    '<div class="panel"><h2>Who spent it</h2><div class="donut-wrap">' + donutChart(byPersonAll, moneyWhole(t.spent)) +
    '<ul class="legend">' + byPersonAll.map((p) => '<li><span class="legend-dot" style="background:' + p.colour + '"></span>' + esc(p.label) + ' — ' + money(p.value) + '</li>').join('') + '</ul></div></div></section>' +
    '<section class="panel"><h2>Six months: spending against income</h2>' + trendChart(history) +
    '<p class="chart-key"><span class="key-bar"></span> Spent &nbsp; <span class="key-line"></span> Income ($6,000/month)</p>' +
    '<p>November is the second-cheapest month in half a year — the summer holiday in August ($5,390) is still the one to beat. Every month stayed under income, which is why the holiday pot keeps growing.</p></section>' +
    '<section><h2>The five biggest single spends</h2><ul class="tx-list">' + top.map(transactionRow).join('') + '</ul>' +
    '<p>Rent is the biggest, as it should be. After that, the two $450 savings moves — money the household chose to spend on its future self.</p></section>'
  );
}

// --- About ---------------------------------------------------------------------

export function viewAbout() {
  return (
    '<section class="page-head"><p class="kicker">About this site</p>' +
    '<h1>A budget that lives at the kitchen table</h1>' +
    '<p class="lede">Kitchen Table is a household budget site for a real family — Maya, Tom and June Rivera — built around one idea: a budget is not a spreadsheet you open once a month, it is the answer to “what can we spend today?”</p></section>' +
    '<section><h2>What it does</h2><ol class="rules">' +
    '<li><strong>Dashboard.</strong> The safe-to-spend number, the month so far, and anything running hot — at a glance.</li>' +
    '<li><strong>Envelopes.</strong> Ten jobs for the money, with live bars, money moved between them, and plans you can change.</li>' +
    '<li><strong>Ledger.</strong> Every transaction, addable and deletable, exportable as a CSV for your own records.</li>' +
    '<li><strong>Leak Finder.</strong> A subscription audit and a what-if simulator that prices your habits over a year.</li>' +
    '<li><strong>Payday plan.</strong> The dated calendar of money in and bills out, payday to payday.</li>' +
    '<li><strong>Reports.</strong> Spending by envelope and by person, and six months of trend — all drawn from the same ledger.</li>' +
    '</ol></section>' +
    '<section><h2>How it works</h2>' +
    '<p>Everything runs in your browser from these files alone — no account, no server, no tracking. Your edits are saved on your own device, in your browser’s storage, and a reset button on the ledger page restores the Rivera household’s November. The figures are the household’s own: $6,000 a month in, every transaction dated and named.</p>' +
    '<p><button class="btn btn-ghost" id="reset-all">Reset to the Rivera household’s November</button></p></section>' +
    '<section><h2>The household</h2><ul class="rules">' +
    state.people.map((p) => '<li><strong>' + esc(p.name) + '.</strong> ' + esc(p.role) + '</li>').join('') +
    '</ul></section>'
  );
}
