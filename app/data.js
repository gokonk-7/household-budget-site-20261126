// Seed data for the Rivera household — November 2026.
// Every figure here is the household's own record: real amounts, real dates,
// real merchants. Nothing is a placeholder; the app lets the household edit,
// add and delete any of it, and saves changes in the browser.

// The people who share this budget.
export const people = [
  { id: 'maya', name: 'Maya', role: 'Teacher · paid 15th & 30th', colour: '#2e6b4f' },
  { id: 'tom', name: 'Tom', role: 'Nurse · paid every Friday', colour: '#b4552d' },
  { id: 'june', name: 'June', role: 'Age 9 · pocket money', colour: '#7a5ea8' },
  { id: 'shared', name: 'Shared', role: 'Paid from the joint account', colour: '#5b6470' },
];

// Monthly take-home pay, by person.
export const income = [
  { id: 'inc-maya', person: 'maya', label: 'Maya — teaching salary', amount: 3150, day: 15 },
  { id: 'inc-tom', person: 'tom', label: 'Tom — nursing shifts', amount: 2850, day: 7 },
];

// One envelope per job the money has to do. `budget` is the monthly plan,
// `spent` is recomputed from transactions at load, so the two can never drift.
export const envelopes = [
  { id: 'rent', name: 'Rent & utilities', budget: 1950, note: 'Rent $1,450 + power, water, phones, internet', icon: '⌂' },
  { id: 'groceries', name: 'Groceries', budget: 820, note: 'Weekly shop at Marigold Market, Sat mornings', icon: '◍' },
  { id: 'transport', name: 'Transport', budget: 340, note: 'Fuel, bus passes, one car service a year', icon: '➜' },
  { id: 'eating-out', name: 'Eating out', budget: 220, note: 'Takeaway Fridays + one restaurant night', icon: '✦' },
  { id: 'kids', name: 'Kids & school', budget: 280, note: 'June: lunches, clubs, shoes that never last', icon: '✎' },
  { id: 'fun', name: 'Fun & treats', budget: 200, note: 'Cinema, books, the odd bunch of flowers', icon: '♪' },
  { id: 'home', name: 'Home & garden', budget: 160, note: 'Fixes, plants, the leaking tap fund', icon: '⚒' },
  { id: 'health', name: 'Health', budget: 120, note: 'Pharmacy, dentist check-ups, vitamins', icon: '+' },
  { id: 'savings', name: 'Savings', budget: 900, note: 'Moves to the holiday pot on payday', icon: '◆' },
  { id: 'buffer', name: 'Buffer', budget: 1010, note: 'Whatever is left — the month never goes as planned', icon: '○' },
];

// Bills that land on fixed dates, so the planner can count them down.
export const bills = [
  { id: 'bill-rent', label: 'Rent — 14 Oak Lane', amount: 1450, day: 1, envelope: 'rent', autopay: true },
  { id: 'bill-power', label: 'Power — City Light', amount: 132, day: 5, envelope: 'rent', autopay: true },
  { id: 'bill-internet', label: 'Internet — Northline 500', amount: 65, day: 8, envelope: 'rent', autopay: true },
  { id: 'bill-water', label: 'Water & sewer', amount: 48, day: 12, envelope: 'rent', autopay: false },
  { id: 'bill-insurance', label: 'Car insurance', amount: 118, day: 12, envelope: 'transport', autopay: true },
  { id: 'bill-phone', label: 'Phones — Maya & Tom', amount: 74, day: 18, envelope: 'rent', autopay: true },
  { id: 'bill-gym', label: 'Gym — Riverside Fitness', amount: 42, day: 20, envelope: 'health', autopay: true },
  { id: 'bill-school', label: 'June — after-school club', amount: 95, day: 25, envelope: 'kids', autopay: false },
];

// Every transaction of November so far. `kind` is 'out' or 'in'.
// The dashboard, the ledger and the reports all read this one list.
export const transactions = [
  { id: 't01', date: '2026-11-01', person: 'shared', envelope: 'rent', label: 'Rent — 14 Oak Lane', amount: 1450, kind: 'out', note: 'Autopay, 1st of the month' },
  { id: 't02', date: '2026-11-01', person: 'maya', envelope: 'savings', label: 'To holiday pot', amount: 450, kind: 'out', note: 'Payday move' },
  { id: 't03', date: '2026-11-02', person: 'tom', envelope: 'groceries', label: 'Marigold Market — weekly shop', amount: 148.2, kind: 'out', note: 'Includes Thanksgiving pantry stock-up' },
  { id: 't04', date: '2026-11-02', person: 'tom', envelope: 'transport', label: 'Fuel — Corner Petrol', amount: 52.4, kind: 'out', note: '' },
  { id: 't05', date: '2026-11-03', person: 'maya', envelope: 'eating-out', label: 'Noodle House — takeaway', amount: 34.5, kind: 'out', note: 'Tuesday, nobody felt like cooking' },
  { id: 't06', date: '2026-11-04', person: 'maya', envelope: 'kids', label: 'June — school lunch money', amount: 25, kind: 'out', note: 'Week of lunches' },
  { id: 't07', date: '2026-11-05', person: 'shared', envelope: 'rent', label: 'Power — City Light', amount: 132, kind: 'out', note: 'Autopay' },
  { id: 't08', date: '2026-11-06', person: 'tom', envelope: 'eating-out', label: 'Pizza Friday — Tony’s', amount: 28.9, kind: 'out', note: 'Family tradition, every Friday' },
  { id: 't09', date: '2026-11-07', person: 'maya', envelope: 'groceries', label: 'Marigold Market — weekly shop', amount: 121.75, kind: 'out', note: '' },
  { id: 't10', date: '2026-11-07', person: 'tom', envelope: 'fun', label: 'Cinema — Saturday matinee', amount: 38, kind: 'out', note: 'June picked the film' },
  { id: 't11', date: '2026-11-08', person: 'shared', envelope: 'rent', label: 'Internet — Northline 500', amount: 65, kind: 'out', note: 'Autopay' },
  { id: 't12', date: '2026-11-09', person: 'maya', envelope: 'health', label: 'Pharmacy — cold medicine', amount: 18.6, kind: 'out', note: 'June caught Tom’s cold' },
  { id: 't13', date: '2026-11-10', person: 'tom', envelope: 'transport', label: 'Bus pass — Tom (monthly)', amount: 68, kind: 'out', note: '' },
  { id: 't14', date: '2026-11-11', person: 'maya', envelope: 'groceries', label: 'Corner grocer — top-up', amount: 42.3, kind: 'out', note: 'Milk, eggs, bread, fruit' },
  { id: 't15', date: '2026-11-12', person: 'shared', envelope: 'rent', label: 'Water & sewer', amount: 48, kind: 'out', note: 'Paid by hand this month' },
  { id: 't16', date: '2026-11-12', person: 'tom', envelope: 'eating-out', label: 'Burger van — lunch', amount: 16.4, kind: 'out', note: 'Tom’s shift lunch' },
  { id: 't17', date: '2026-11-13', person: 'maya', envelope: 'kids', label: 'June — art club term fee', amount: 45, kind: 'out', note: 'Autumn term' },
  { id: 't18', date: '2026-11-14', person: 'tom', envelope: 'groceries', label: 'Marigold Market — weekly shop', amount: 134.9, kind: 'out', note: '' },
  { id: 't19', date: '2026-11-14', person: 'maya', envelope: 'home', label: 'Hardware — tap washer kit', amount: 12.8, kind: 'out', note: 'The leaking tap, finally fixed' },
  { id: 't20', date: '2026-11-15', person: 'shared', envelope: 'savings', label: 'To holiday pot', amount: 450, kind: 'out', note: 'Second payday move' },
  { id: 't21', date: '2026-11-15', person: 'tom', envelope: 'fun', label: 'Bookshop — Maya’s novel', amount: 19.99, kind: 'out', note: '' },
  { id: 't22', date: '2026-11-16', person: 'maya', envelope: 'eating-out', label: 'Noodle House — takeaway', amount: 31.2, kind: 'out', note: 'Second takeaway this month' },
  { id: 't23', date: '2026-11-17', person: 'tom', envelope: 'transport', label: 'Fuel — Corner Petrol', amount: 48.75, kind: 'out', note: '' },
  { id: 't24', date: '2026-11-18', person: 'maya', envelope: 'groceries', label: 'Marigold Market — weekly shop', amount: 118.6, kind: 'out', note: '' },
  { id: 't25', date: '2026-11-19', person: 'tom', envelope: 'health', label: 'Dentist — Tom check-up', amount: 16.4, kind: 'out', note: 'Check-up only, no work needed' },
  { id: 't26', date: '2026-11-20', person: 'maya', envelope: 'eating-out', label: 'Pizza Friday — Tony’s', amount: 21.5, kind: 'out', note: '' },
  { id: 't27', date: '2026-11-21', person: 'tom', envelope: 'groceries', label: 'Marigold Market — weekly shop', amount: 127.4, kind: 'out', note: 'Includes June’s birthday cake mix' },
  { id: 't28', date: '2026-11-22', person: 'june', envelope: 'kids', label: 'June — birthday present money', amount: 26, kind: 'out', note: 'From her pocket-money jar' },
  { id: 't29', date: '2026-11-23', person: 'maya', envelope: 'home', label: 'Garden centre — winter bulbs', amount: 28.2, kind: 'out', note: '' },
  { id: 't30', date: '2026-11-24', person: 'tom', envelope: 'fun', label: 'Streaming rental — film night', amount: 9.99, kind: 'out', note: '' },
  { id: 't31', date: '2026-11-25', person: 'maya', envelope: 'groceries', label: 'Corner grocer — top-up', amount: 19.85, kind: 'out', note: 'Milk and bread' },
  { id: 't32', date: '2026-11-25', person: 'tom', envelope: 'transport', label: 'Car wash', amount: 12, kind: 'out', note: '' },
  { id: 't33', date: '2026-11-26', person: 'maya', envelope: 'eating-out', label: 'Coffee & cake — Maya & friend', amount: 14.6, kind: 'out', note: 'Caught up with Priya' },
  { id: 't34', date: '2026-11-07', person: 'maya', envelope: 'savings', label: 'Birthday money from Gran', amount: 50, kind: 'in', note: 'June’s birthday — straight to savings' },
  { id: 't35', date: '2026-11-15', person: 'tom', envelope: 'fun', label: 'Sold old bike on marketplace', amount: 85, kind: 'in', note: 'Tom’s old road bike' },
];

// Subscriptions the Leak Finder audits. `lastUsed` is a plain date so the
// household can see at a glance what it still uses and what it forgot.
export const subscriptions = [
  { id: 's01', name: 'StreamFlix', amount: 15.49, period: 'month', lastUsed: '2026-11-24', note: 'Family movie nights, twice a week' },
  { id: 's02', name: 'TuneWave music', amount: 11.99, period: 'month', lastUsed: '2026-11-26', note: 'Maya runs to it every morning' },
  { id: 's03', name: 'Riverside Fitness gym', amount: 42, period: 'month', lastUsed: '2026-10-19', note: 'Nobody has been in five weeks' },
  { id: 's04', name: 'CloudBox storage', amount: 9.99, period: 'month', lastUsed: '2026-11-02', note: 'Phone photo backup' },
  { id: 's05', name: 'FreshCrate meal kit', amount: 69, period: 'month', lastUsed: '2026-11-09', note: 'Two boxes a month, often skipped' },
  { id: 's06', name: 'Daily Post news', amount: 12, period: 'month', lastUsed: '2026-11-25', note: 'Tom reads it over breakfast' },
  { id: 's07', name: 'StarLearn kids app', amount: 7.99, period: 'month', lastUsed: '2026-11-23', note: 'June’s maths games' },
  { id: 's08', name: 'GamePass', amount: 9.99, period: 'month', lastUsed: '2026-09-28', note: 'Tom’s — untouched since September' },
];

// Monthly spending for the last six months, for the trend chart.
export const monthlyHistory = [
  { month: 'Jun 26', spent: 4860, income: 6000 },
  { month: 'Jul 26', spent: 5120, income: 6000 },
  { month: 'Aug 26', spent: 5390, income: 6000 },
  { month: 'Sep 26', spent: 4715, income: 6000 },
  { month: 'Oct 26', spent: 4980, income: 6000 },
  { month: 'Nov 26', spent: 0, income: 6000 }, // filled in live from transactions
];

// The household's own money rules, written at the kitchen table.
export const houseRules = [
  { rule: 'Payday first', text: 'On payday, savings move before anything is spent. $450 on the 1st, $450 on the 15th — no debate.' },
  { rule: 'Pizza Friday is sacred', text: 'Takeaway is allowed every Friday and one other night a week. A third takeaway comes out of Fun, not Groceries.' },
  { rule: 'The $20 question', text: 'Anything over $20 that is not food, fuel or a bill waits 24 hours before we buy it.' },
  { rule: 'June gets a say', text: 'June has $26 a month of her own. She chooses, she tracks it, and nobody borrows from it.' },
  { rule: 'Buffer is not free money', text: 'The Buffer envelope is for surprises, not for topping up envelopes we overspent on purpose.' },
];
