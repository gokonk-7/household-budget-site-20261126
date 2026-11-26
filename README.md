# household-budget-site-20261126

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/gokonk-7/household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/gokonk-7/household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Kitchen Table — a household budget site for the Rivera family (Maya, Tom and June), built around one idea: a budget is not a spreadsheet you open once a month, it is the answer to “what can we spend today?”

The dashboard leads with that number — safe to spend per day, after the bills still to come — then the month so far, and anything running hot. Around it: ten envelopes with live bars and money you can move between them; a ledger where every transaction is dated, named and addable, exportable as CSV; a Leak Finder that audits every subscription and prices your habits with a what-if simulator; a payday-to-payday plan of money in and bills out; and reports that show where the money actually went, by envelope, by person and over six months.

Everything runs in the browser from static files alone — no account, no server, no network requests, no tracking. Edits are saved on your own device, in your browser's storage. The figures are the household's own: $6,000 a month in, 35 transactions dated through 26 November 2026, and every control does what it says.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — the dashboard, the envelopes, the ledger, the Leak Finder, the payday plan and the reports are all reached from the navigation at the top. To hand the site in, run `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`, which copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=sqj6a0rx&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
