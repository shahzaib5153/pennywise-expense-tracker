# Pennywise Personal Expense Tracker
A small, responsive to-do list built with HTML, CSS, and JavaScript. Tasks are stored in browser localStorage, so the list remains available after refreshing the page.

Repository:https://github.com/shahzaib5153/pennywise-expense-tracker
:Live deployed application:https://shahzaib5153.github.io/pennywise-expense-tracker/

## Run locally

Open `index.html` in a browser. The app supports recording expenses, category summaries, search, category filtering, deletion, and clear-all.

## Test locally

When Python is installed, run:

```powershell
python test_app.py
```

The GitHub Actions workflow runs this smoke test automatically on pushes and pull requests targeting `main`.

## GitHub and DevOps workflow

1. Create an empty GitHub repository named `pennywise-expense-tracker`.
2. In this folder, initialize Git and connect the remote:

```powershell
git init
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/daymark-todo.git
```

3. Make the required meaningful commits:

```powershell
git add index.html styles.css app.js
 git commit -m "Initial application structure"
git add .
git commit -m "Add task management features"
git add README.md .github/workflows
 git commit -m "Add CI and GitHub Pages delivery"
git push -u origin main
```

4. To demonstrate a failed CI run, temporarily change the expected title in `test_app.py`, commit and push it, and capture the failed Actions run. Restore the title, commit the fix, and push again to capture the successful run.
5. In GitHub, open **Settings > Pages**, choose **GitHub Actions** as the source, and wait for `Deploy to GitHub Pages` to publish the site.

The Pages workflow deploys the repository root on every push to `main`.
