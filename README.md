# Pathway — Internship Application Tracker

A beginner-friendly React + Vite dashboard for organizing internship applications. This first version focuses on the main dashboard, a working application tracker, and a deadline timeline. Example companies and application outcomes are fictional sample data for demonstration; edit or remove them to make the tracker your own.

## What works

- Dashboard metrics for opportunities, submissions, active applications, interviews, offers, and offer rate.
- Interactive six-month submission chart and status chart (Recharts).
- Add and edit applications in a validated form; delete with confirmation.
- Search by company, position, industry, or location; filter by status and industry; sort by deadline, company, or status.
- Deadline timeline with days remaining, overdue markers, and alerts for deadlines within seven days.
- Automatic saving in browser `localStorage`.
- Responsive sidebar and layout for phones and laptops.

The dashboard counts an application as submitted unless it is in Interested or Preparing. Offer rate is offers divided by submitted applications. The deadline list excludes offers and rejections.

## Run locally in VS Code

Install [Node.js LTS](https://nodejs.org/) and [VS Code](https://code.visualstudio.com/). Open this project folder in VS Code, then open **Terminal → New Terminal** and run:

```bash
npm install
npm run dev
```

Open the local address Vite prints (usually `http://localhost:5173`). Keep the terminal running while you use the app. To verify a production build:

```bash
npm run build
npm run preview
```

### Main files

- `src/main.jsx` starts the React app and loads the stylesheet.
- `src/App.jsx` contains the dashboard, application table, reusable stat/status/form components, chart data, filters, and localStorage logic.
- `src/styles.css` contains the responsive layout and visual styling.
- `package.json` lists dependencies and the commands above.

## Upload this project to GitHub

This project is already in the `ellabryan/ellabryanwebpage` GitHub repository. To get it onto your computer, use **Code → HTTPS** on GitHub and run the following in a terminal (replace the URL if you use SSH):

```bash
git clone https://github.com/ellabryan/ellabryanwebpage.git
cd ellabryanwebpage
```

After making local changes, upload them with:

```bash
git add .
git commit -m "Build internship application tracker"
git push origin main
```

If you are starting from a local folder that is not cloned from GitHub, create an empty repository on GitHub first, then connect it using the repository URL:

```bash
git init
git add .
git commit -m "Build internship application tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Deploy on Vercel

1. Push the project to GitHub.
2. Sign in at [vercel.com](https://vercel.com/) and choose **Add New → Project**.
3. Import `ellabryan/ellabryanwebpage` (or your own repository).
4. Vercel detects Vite automatically. Use build command `npm run build` and output directory `dist` if prompted.
5. Choose **Deploy**. Vercel gives you a public URL and can redeploy when you push later changes.

## Data and next steps

Application data lives only in this browser's localStorage: it is not synced to another device or account. Clearing site data or using a different browser will not transfer it. This starter is deliberately scoped to the dashboard, application tracker, and deadline timeline; company research, networking contacts, calendar reminders, and interview checklists can be added as later features.
