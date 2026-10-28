# CaseBridge
An Institution Centered Complaint Coordination  

## 📋 Overview

The **AICTE Complaint Monitoring Dashboard** provides secretariat cells and administrative staff with a unified interface to:

- View KPI summaries (total, open, escalated, resolved complaints, SLA compliance)
- Browse and search 30+ seeded complaints with live filtering
- Drill down into bureau-level and institution-level metrics
- Update complaint status with timeline tracking
- Visualize filing trends and SLA risk indicators

## 🚀 Live Demo

**Preview:** https://casebridge-sigma.vercel.app/

> **Note:** Complaints are stored per-browser (localStorage). The seeded 30 complaints are shared, but individual edits remain local to each visitor's browser.

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **State:** React `useState` + localStorage persistence
- **Deployment:** Freebuff Sites (Cloudflare Workers)
- **Build:** `npm run build` → static assets + Worker

## 📦 Features

### Dashboard (Overview page)

- **KPI Cards:** Total complaints, open count, escalated, resolved, SLA compliance %
- **Monthly Filing Trend:** Sparkline chart of complaints over time
- **Status Donut:** Distribution of complaint statuses
- **Bureau Bars:** Open complaints by AICTE bureau/cell
- **SLA Risk Panel:** Overdue cases needing attention
- **Recent Complaints:** Last 10 filed cases

### Complaints Register

- **Live Search:** Filter by keyword across all fields
- **Multi-filter:** Bureau, Status, Priority, Institution
- **Sortable Columns:** Click any column header to sort
- **Badges:** Overdue / SLA-due warnings
- **New Complaint Form:** Register a new case with auto-generated ID (`AIT/2026/xxxx`)
- **Detail Drawer:** Full complaint metadata, description, action timeline

### Bureaus & Cells

- **Per-bureau cards:** Open/escalated/resolved counts, average resolution days, SLA meter
- **Jump-to-filtered-list:** Click to filter the complaints register

### Institutions

- **12 institutions** with approval status, complaint counts, overdue counts
- **Drill-down:** Filtered complaints register for each institution

## 🏁 Quick Start

```bash
# Install
npm install

# Dev server (bound to 0.0.0.0 for preview)
npm run dev

# Build
npm run build
```

## 📁 Project Structure

```
src/
├── data/           # mockData.js — all seed data (complaints, bureaus, institutions, SLA rules)
├── components/     # UI components (Sidebar, ComplaintTable, ComplaintDrawer, NewComplaintModal, Icon)
├── pages/          # Four page components (Overview, Complaints, Bureaus, Institutions)
├── App.jsx         # App shell: state, persistence, routing, toast notifications
└── lib/store.js    # localStorage persistence layer (load/save/reset)
```

## 📦 Persistence Layer

Complaint data is persisted in **browser localStorage** via `src/lib/store.js`. This means:

- ✅ Changes survive page reloads
- ✅ Each visitor's edits stay in their own browser
- ❌ Not shared between devices/users (for true multi-user persistence, swap in D1 database)

To replace with a real API, edit `App.jsx`'s `saveComplaints` call and the `loadComplaints` import.

## 🌐 Deployment

This project is configured for **Freebuff Sites**:

1. Run `npm run build`
2. Deploy via Freebuff dashboard or `npx convex deploy`
3. The `site/freebuff.deploy.json` manifest handles the Worker build

## 🎨 Customization

- **Colors:** Theme colors are defined in `tailwind.config.js` (`#0B2545`, `#F0A93B`)
- **Data:** Replace `INITIAL_COMPLAINTS` in `src/data/mockData.js` with real API data
- **Bureaus/Institutions:** Add/remove entries in `mockData.js`
- **SLA Rules:** Adjust `SLA_DAYS` and compliance thresholds in mockData

## 📄 License

MIT License – free for academic and institutional use.

## 🙏 Acknowledgements

- Icons and design inspired by AICTE official guidelines