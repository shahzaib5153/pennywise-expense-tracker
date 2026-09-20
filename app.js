const STORAGE_KEY = 'pennywise-expenses';
let expenses = loadExpenses();
const today = new Date();
const dateInput = document.querySelector('#date-input');
dateInput.value = toDateValue(today);
document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(today);
document.querySelector('#month-label').textContent = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(today);

document.querySelector('#expense-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const amount = Number(document.querySelector('#amount-input').value);
  const note = document.querySelector('#note-input').value.trim();
  if (!amount || amount < 0) return;
  expenses.unshift({ id: crypto.randomUUID(), amount, category: document.querySelector('#category-input').value, date: dateInput.value, note: note || 'Untitled expense' });
  event.target.reset();
  dateInput.value = toDateValue(today);
  saveAndRender();
  document.querySelector('#amount-input').focus();
});

document.querySelector('#search-input').addEventListener('input', render);
document.querySelector('#filter-input').addEventListener('change', render);
document.querySelector('#expense-list').addEventListener('click', (event) => {
  const item = event.target.closest('[data-id]');
  if (!item) return;
  if (event.target.closest('.delete-expense')) expenses = expenses.filter((expense) => expense.id !== item.dataset.id);
  saveAndRender();
});

document.querySelector('#clear-expenses').addEventListener('click', () => {
  expenses = [];
  saveAndRender();
});

function loadExpenses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  render();
}

function render() {
  const search = document.querySelector('#search-input').value.toLowerCase();
  const category = document.querySelector('#filter-input').value;
  const visibleExpenses = expenses.filter((expense) => (category === 'all' || expense.category === category) && `${expense.note} ${expense.category}`.toLowerCase().includes(search));
  document.querySelector('#expense-list').innerHTML = visibleExpenses.map((expense) => `<div class="expense-row" data-id="${expense.id}" role="row"><span class="date-cell">${formatDate(expense.date)}</span><span class="description-cell"><strong>${escapeHtml(expense.note)}</strong><small>${escapeHtml(expense.category)}</small></span><span><span class="category-pill category-${expense.category.toLowerCase()}">${escapeHtml(expense.category)}</span></span><strong class="amount-cell">${formatMoney(expense.amount)}</strong><button class="delete-expense" type="button" aria-label="Delete ${escapeHtml(expense.note)}">×</button></div>`).join('');
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  document.querySelector('#month-total').textContent = formatMoney(total);
  document.querySelector('#expense-count').textContent = `${expenses.length} ${expenses.length === 1 ? 'expense' : 'expenses'} recorded`;
  document.querySelector('#average-total').textContent = formatMoney(expenses.length ? total / expenses.length : 0);
  const categoryTotals = expenses.reduce((totals, expense) => { totals[expense.category] = (totals[expense.category] || 0) + expense.amount; return totals; }, {});
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  document.querySelector('#top-category').textContent = sortedCategories[0]?.[0] || '—';
  document.querySelector('#top-category-total').textContent = sortedCategories[0] ? formatMoney(sortedCategories[0][1]) + ' this month' : 'Add an expense to begin';
  const max = sortedCategories[0]?.[1] || 1;
  document.querySelector('#category-breakdown').innerHTML = sortedCategories.length ? sortedCategories.map(([name, value]) => `<div class="breakdown-row"><div><span>${escapeHtml(name)}</span><strong>${formatMoney(value)}</strong></div><div class="progress-track"><span style="width: ${(value / max) * 100}%"></span></div></div>`).join('') : '<p class="muted-message">Your category breakdown will appear here.</p>';
  document.querySelector('#empty-state').hidden = visibleExpenses.length > 0;
  document.querySelector('#empty-title').textContent = expenses.length && !visibleExpenses.length ? 'No matching expenses.' : 'Your ledger is waiting.';
  document.querySelector('#empty-copy').textContent = expenses.length && !visibleExpenses.length ? 'Try another search or category.' : 'Record your first expense above.';
}

function formatMoney(value) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value); }
function formatDate(value) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`)); }
function toDateValue(value) { return value.toISOString().slice(0, 10); }

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

render();
