// The router and the wiring: which page shows, and what every control does.
// Views return HTML; this file puts it on the page and listens to it.

import { addTransaction, deleteTransaction, setEnvelopeBudget, moveMoney, toggleCutSubscription, subscriptionTotals, ledgerCsv, resetAll } from './store.js';
import { money } from './format.js';
import { viewDashboard, viewEnvelopes, viewTransactions, viewLeaks, viewPlan, viewReports, viewAbout } from './views.js';

const routes = {
  '/': viewDashboard,
  '/envelopes': viewEnvelopes,
  '/transactions': viewTransactions,
  '/leaks': viewLeaks,
  '/plan': viewPlan,
  '/reports': viewReports,
  '/about': viewAbout,
};

const TITLES = {
  '/': 'Kitchen Table — the household budget that lives where money gets talked about',
  '/envelopes': 'Envelopes — Kitchen Table',
  '/transactions': 'The ledger — Kitchen Table',
  '/leaks': 'The Leak Finder — Kitchen Table',
  '/plan': 'Payday plan — Kitchen Table',
  '/reports': 'Reports — Kitchen Table',
  '/about': 'About — Kitchen Table',
};

const app = document.getElementById('app');
const nav = document.getElementById('site-nav');

function currentRoute() {
  const hash = location.hash.replace(/^#/, '') || '/';
  return routes[hash] ? hash : '/';
}

function render() {
  const route = currentRoute();
  app.innerHTML = routes[route]();
  document.title = TITLES[route];
  for (const link of nav.querySelectorAll('a')) {
    const href = link.getAttribute('href');
    if (href === '#' + route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
  wirePage(route);
}

// --- Page-specific wiring ------------------------------------------------------

function wirePage(route) {
  if (route === '/transactions') wireLedger();
  if (route === '/envelopes') wireEnvelopes();
  if (route === '/leaks') wireLeaks();
  if (route === '/about') wireAbout();
}

// Delete buttons live on several pages; one listener covers them all.
document.addEventListener('click', (event) => {
  const del = event.target.closest('[data-delete-tx]');
  if (del) {
    if (deleteTransaction(del.getAttribute('data-delete-tx'))) render();
    return;
  }
  const cut = event.target.closest('[data-cut-sub]');
  if (cut) {
    toggleCutSubscription(cut.getAttribute('data-cut-sub'));
    render();
  }
});

function wireLedger() {
  const form = document.getElementById('tx-form');
  const msg = document.getElementById('tx-msg');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    if (!amount || amount <= 0) {
      msg.textContent = 'Enter an amount above $0.';
      return;
    }
    addTransaction({
      date: String(data.get('date')),
      person: String(data.get('person')),
      envelope: String(data.get('envelope')),
      label: String(data.get('label')).trim(),
      amount,
      kind: String(data.get('kind')),
      note: String(data.get('note') || '').trim(),
    });
    render();
    document.getElementById('tx-msg').textContent = 'Added to the ledger — the envelopes and reports already include it.';
  });

  document.getElementById('export-csv').addEventListener('click', () => {
    const blob = new Blob([ledgerCsv()], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rivera-household-ledger-november-2026.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
}

function wireEnvelopes() {
  const moveForm = document.getElementById('move-form');
  const moveMsg = document.getElementById('move-msg');
  moveForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(moveForm);
    const ok = moveMoney(String(data.get('from')), String(data.get('to')), Number(data.get('amount')));
    if (ok) {
      render();
      document.getElementById('move-msg').textContent = 'Moved. The total plan is unchanged — the money just has a new job.';
    } else {
      moveMsg.textContent = 'That did not move: pick two different envelopes, and no more than the first one holds.';
    }
  });

  const budgetForm = document.getElementById('budget-form');
  const budgetMsg = document.getElementById('budget-msg');
  budgetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(budgetForm);
    if (setEnvelopeBudget(String(data.get('envelope')), Number(data.get('budget')))) {
      render();
      document.getElementById('budget-msg').textContent = 'Plan saved. Every page now uses the new budget.';
    } else {
      budgetMsg.textContent = 'That budget did not save — try a whole number of dollars.';
    }
  });
}

function wireLeaks() {
  const takeaway = document.getElementById('sim-takeaway');
  const coffee = document.getElementById('sim-coffee');
  const subs = document.getElementById('sim-subs');
  const result = document.getElementById('sim-result');
  const resultSub = document.getElementById('sim-result-sub');
  const forgottenYearly = subscriptionTotals().forgottenYearly;

  function update() {
    const nights = Number(takeaway.value);
    const coffees = Number(coffee.value);
    const cutSubs = Number(subs.value) === 1;
    document.getElementById('sim-takeaway-out').textContent = String(nights);
    document.getElementById('sim-coffee-out').textContent = String(coffees);
    document.getElementById('sim-subs-out').textContent = cutSubs ? 'cut' : 'keep';
    // Today: 2 takeaway nights and 3 coffees a week, subscriptions kept.
    const savedPerWeek = (2 - nights) * 28 + (3 - coffees) * 4.8;
    const savedPerYear = savedPerWeek * 52 + (cutSubs ? forgottenYearly : 0);
    result.textContent = money(savedPerYear) + ' a year';
    if (savedPerYear <= 0) {
      resultSub.textContent = 'That is today’s habits — nothing changes. Move a slider to see what changes.';
    } else {
      const what = savedPerYear >= 1456
        ? 'That is the family’s summer weekend away, paid for — every year.'
        : savedPerYear >= 500
          ? 'That is June’s after-school club for a year, with change.'
          : 'That is a month of groceries, found in habits nobody would miss.';
      resultSub.textContent = what;
    }
  }
  takeaway.addEventListener('input', update);
  coffee.addEventListener('input', update);
  subs.addEventListener('input', update);
  update();
}

function wireAbout() {
  document.getElementById('reset-all').addEventListener('click', () => {
    if (window.confirm('Reset every change and go back to the Rivera household’s November as it was written?')) resetAll();
  });
}

window.addEventListener('hashchange', render);
render();
