from pathlib import Path

root = Path(__file__).parent
html = (root / 'index.html').read_text(encoding='utf-8')
css = (root / 'styles.css').read_text(encoding='utf-8')
js = (root / 'app.js').read_text(encoding='utf-8')

assert '<title>Pennywise | Personal Expense Tracker</title>' in html
assert 'id="expense-form"' in html and 'id="expense-list"' in html
assert 'localStorage' in js and 'saveAndRender' in js
assert 'category-breakdown' in html and 'formatMoney' in js
assert 'escapeHtml' in js
assert '--accent:' in css and '@media' in css
print('PASS: static app smoke checks')
