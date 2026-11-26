// The household's ledger: one store for all state, one place where every
// number on the site is worked out. Views only read from here; they never
// add figures up themselves, so the dashboard, the envelopes and the reports
// can never disagree.
//
// The household's "today" is fixed at 26 November 2026 — the day this budget
// was written — so every figure on the site is stable and checkable.

import { people, income, envelopes, bills, transactions, subscriptions, monthlyHistory } from './data.js';

export const TODAY = '2026-11-26';
export const MONTH_LABEL = 'November 2026';
export const DAYS_IN_MONTH = 30;

const STORAGE_KEY = 'kitchen-table-budget-v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

// Load: seed data first, then any changes the household saved in the browser.
function loadState() {
  const state = {
    people: clone(people),
    income: clone(income),
    envelopes: clone(envelopes),
    bills: clone(bills),
    transactions: clone(transactions),
    subscriptions: clone(subscriptions),
    monthlyHistory: clone(monthlyHistory),
    cutSubs: [],
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      for (const key of Object.keys(state)) {
        if (Array.isArray(saved[key])) state[key] = saved[key];
      }
    }
  } catch {
    // A damaged save is ignored: the seed data is the budget of record.
  }
  return state;
}

export const state = loadState();

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full store: the site still works for this visit.
  }
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

// --- Lookups ---------------------------------------------------------------

export function personById(id) {
  return state.people.find((p) => p.id === id) || state.people[3];
}

export function envelopeById(id) {
  return state.envelopes.find((e) => e.id === id);
}

export function monthTransactions() {
  return state.transactions.filter((t) => t.date.startsWith('2026-11'));
}

export function spentByEnvelope(envelopeId) {
  return monthTransactions()
    .filter((t) => t.envelope === envelopeId && t.kind === 'out')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function spentByPerson(personId) {
  return monthTransactions()
    .filter((t) => t.person === personId && t.kind === 'out')
    .reduce((sum, t) => sum + t.amount, 0);
}

// --- The headline numbers --------------------------------------------------

export function totals() {
  const tx = monthTransactions();
  const out = tx.filter((t) => t.kind === 'out').reduce((s, t) => s + t.amount, 0);
  const extraIn = tx.filter((t) => t.kind === 'in').reduce((s, t) => s + t.amount, 0);
  const pay = state.income.reduce((s, i) => s + i.amount, 0);
  const incomeTotal = pay + extraIn;
  const daysLeft = DAYS_IN_MONTH - 26; // today is the 26th
  const daysGone = 26;
  return {
    income: incomeTotal,
    pay,
    extraIn,
    spent: out,
    left: incomeTotal - out,
    daysLeft,
    daysGone,
    dailyPace: out / daysGone,
    // Money that must still go out before this month ends: the bills dated
    // after today in November. (December's bills belong to December's pay.)
    committedAhead: upcomingBills().filter((b) => b.month === 'Nov').reduce((s, b) => s + b.amount, 0),
  };
}

// Bills still to come, in date order, with "in N days" attached. The cycle
// wraps into December: a bill dated the 1st is 5 days away, not 25 days ago.
export function upcomingBills() {
  return state.bills
    .map((b) => {
      const inDays = b.day > 26 ? b.day - 26 : (DAYS_IN_MONTH - 26) + b.day;
      return { ...b, inDays, month: b.day > 26 ? 'Nov' : 'Dec' };
    })
    .sort((a, b) => a.inDays - b.inDays);
}

// The number the household actually lives by: what is safe to spend each day
// from now to payday, after the bills still to come are set aside.
export function safeToSpendPerDay() {
  const t = totals();
  const free = t.left - t.committedAhead;
  return { perDay: free / Math.max(t.daysLeft, 1), free, daysLeft: t.daysLeft };
}

// Envelope status: spent, left, and whether it is on pace for the month.
export function envelopeStatus(env) {
  const spent = spentByEnvelope(env.id);
  const left = env.budget - spent;
  const pace = (spent / env.budget) * 100;
  const expected = (26 / DAYS_IN_MONTH) * 100; // 86.7% of the month is gone
  // Fully funded is never "hot": an envelope at exactly 100% did its job.
  const status = pace > 100 ? 'over' : pace > expected + 8 && pace < 100 ? 'hot' : pace > expected - 15 ? 'ontrack' : 'under';
  return { ...env, spent, left, pace, status };
}

export function envelopeStatuses() {
  return state.envelopes.map(envelopeStatus);
}

// Subscriptions: monthly cost, yearly cost, and whether it looks forgotten.
export function subscriptionStatus(sub) {
  const last = new Date(sub.lastUsed + 'T12:00:00');
  const today = new Date(TODAY + 'T12:00:00');
  const idleDays = Math.round((today - last) / 86400000);
  const cut = state.cutSubs.includes(sub.id);
  return {
    ...sub,
    idleDays,
    yearly: sub.amount * 12,
    forgotten: idleDays >= 30,
    stale: idleDays >= 14 && idleDays < 30,
    cut,
  };
}

export function subscriptionStatuses() {
  return state.subscriptions.map(subscriptionStatus);
}

export function subscriptionTotals() {
  const list = subscriptionStatuses().filter((s) => !s.cut);
  const monthly = list.reduce((s, x) => s + x.amount, 0);
  const forgotten = list.filter((s) => s.forgotten).reduce((s, x) => s + x.amount, 0);
  return { monthly, yearly: monthly * 12, forgottenMonthly: forgotten, forgottenYearly: forgotten * 12, count: list.length };
}

// Six-month trend, with November filled in live from the ledger.
export function historyWithNovember() {
  const t = totals();
  return state.monthlyHistory.map((m) => (m.month === 'Nov 26' ? { ...m, spent: Math.round(t.spent) } : m));
}

// --- Edits -----------------------------------------------------------------

export function addTransaction(tx) {
  const id = 't' + String(Date.now()).slice(-6) + Math.floor(Math.random() * 90 + 10);
  state.transactions.push({ id, ...tx });
  save();
  return id;
}

export function deleteTransaction(id) {
  const i = state.transactions.findIndex((t) => t.id === id);
  if (i >= 0) {
    state.transactions.splice(i, 1);
    save();
    return true;
  }
  return false;
}

export function setEnvelopeBudget(id, budget) {
  const env = envelopeById(id);
  if (!env) return false;
  env.budget = Math.max(0, Math.round(Number(budget) || 0));
  save();
  return true;
}

// Move money between two envelopes: the plan changes, the total does not.
export function moveMoney(fromId, toId, amount) {
  const from = envelopeById(fromId);
  const to = envelopeById(toId);
  const n = Math.max(0, Math.round(Number(amount) || 0));
  if (!from || !to || fromId === toId || n === 0 || n > from.budget) return false;
  from.budget -= n;
  to.budget += n;
  save();
  return true;
}

export function toggleCutSubscription(id) {
  const i = state.cutSubs.indexOf(id);
  if (i >= 0) state.cutSubs.splice(i, 1);
  else state.cutSubs.push(id);
  save();
}

// Export the month's ledger as CSV, for the household's own records.
export function ledgerCsv() {
  const rows = [['Date', 'Who', 'Envelope', 'What', 'Amount', 'Kind', 'Note']];
  for (const t of [...monthTransactions()].sort((a, b) => a.date.localeCompare(b.date))) {
    const q = (v) => '"' + String(v).replaceAll('"', '""') + '"';
    rows.push([t.date, personById(t.person).name, envelopeById(t.envelope)?.name || t.envelope, q(t.label), t.amount.toFixed(2), t.kind, q(t.note || '')]);
  }
  return rows.map((r) => r.join(',')).join('\n');
}
