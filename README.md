# 🌟 TALENTFLOW – A MINI HIRING PLATFORM

A front-end–only React + TypeScript application that simulates a hiring management platform.
TalentFlow lets HR teams manage **Jobs**, **Candidates**, and **Assessments** with a fast, interactive UI powered by **MirageJS** for mock APIs and **IndexedDB** persistence.

---

## 🚀 Features

### 🧩 Jobs Management

* Create, edit, archive, and reorder jobs.
* Validation (unique slugs, required fields).
* Server-like pagination and filtering (title, status, tags).
* Drag-and-drop reordering with optimistic updates and rollback.
* Deep linking: `/jobs/:jobId`.

### 👤 Candidates Management

* Virtualized list (1000+ seeded candidates) with fast search and filter by stage.
* Candidate profile route: `/candidates/:id` showing timeline of status changes.
* Kanban-style board to move candidates between stages (drag-and-drop).
* Notes with `@mentions` and local suggestions.

### 📝 Assessments

* Per-job assessment builder with sections and question types:

  * Single choice, multi choice, short/long text, numeric, file upload.
* Live preview of form while building.
* Conditional questions (show/hide based on previous answers).
* Local persistence and validation (required, ranges, max length).

---

## 🏗️ Architecture Overview

The app mimics a full-stack setup entirely on the front end:

| Layer                | Tool/Concept                      | Description                                            |
| -------------------- | --------------------------------- | ------------------------------------------------------ |
| **UI Layer**         | React + TypeScript + Vite         | Component-based architecture with clean separation.    |
| **State Management** | Context API / Custom Hooks        | Modular handling of jobs, candidates, and assessments. |
| **Mock Backend**     | MirageJS                          | Simulated REST API with latency and failure handling.  |
| **Persistence**      | IndexedDB (via localForage/Dexie) | Local data storage with restore on refresh.            |
| **Animations & UX**  | Framer Motion + Lucide Icons      | Smooth interactions and consistent design.             |

---

## 🧰 Folder Structure

```
src/
├── assets/           # Static assets (images, icons, logos)
├── auth/             # Authentication mock logic (if any)
├── components/       # Reusable UI components
├── context/          # Global React contexts (Theme, Data, etc.)
├── db/               # IndexedDB setup and helpers
├── forms/            # Dynamic form components for assessments
├── hooks/            # Custom hooks (useJobs, useCandidates, etc.)
├── lib/              # Utility libraries, Mirage setup
├── mirage/           # MirageJS API routes, models, and seeds
├── pages/            # Route-level components
│   ├── Assessments/
│   ├── Candidates/
│   ├── home/
│   └── Jobs/
├── services/         # API-like service wrappers
│   ├── assessmentService.ts
│   ├── candidateService.ts
│   └── jobService.ts
├── utils/            # Shared helpers, data, and constants
│   ├── data.ts
│   ├── helper.ts
│   └── variants.ts
├── App.tsx           # Root application component
├── main.tsx          # Vite entry point
└── types.ts          # Global TypeScript types
```

---

## ⚙️ Tech Stack

* **React 18 + TypeScript**
* **Vite** for blazing-fast builds
* **MirageJS** for mock APIs
* **Framer Motion** for animations
* **Lucide Icons** for clean UI icons
* **localForage / Dexie.js** for IndexedDB persistence
* **TailwindCSS** for styling

---

## 💻 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/talentflow.git
cd talentflow
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the project root:

```bash
VITE_APP_NAME=TalentFlow
VITE_API_BASE_URL=/api
```

> ✅ `.env` is ignored by Git. You can provide a `.env.example` for reference.

### 4. Run the Development Server

```bash
npm run dev
```

App runs at:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing & Mock API

* MirageJS simulates all API endpoints defined in `/mirage`.
* Artificial latency: 200–1200ms.
* Error rate: 5–10% for write endpoints.
* All data persists locally through IndexedDB.

---

## 📦 Build for Production

```bash
npm run build
```

Outputs compiled static files to the `/dist` folder.

---

## 📘 Example Endpoints (Mirage)

| Endpoint              | Method           | Description            |
| --------------------- | ---------------- | ---------------------- |
| `/jobs`               | GET, POST, PATCH | Manage job listings    |
| `/candidates`         | GET, POST, PATCH | Manage candidates      |
| `/assessments/:jobId` | GET, PUT, POST   | Manage job assessments |

---

## 🧩 Design & UX Highlights

* Clean modular UI with dark/light theme toggle.
* Responsive layout for both desktop and tablet.
* Virtualized candidate list for ultra-fast rendering.
* Optimistic UI updates with rollback on Mirage failure.

---

## 🧠 Technical Decisions

* Used **MirageJS** for realistic network simulation instead of static JSON.
* IndexedDB chosen over localStorage for large dataset persistence.
* TypeScript used throughout for maintainability and type safety.
* Modular folder organization separating concerns cleanly.
* Focused on performance via virtualization and debounced search.

---


## 🧡 Author

**Karthikeya Madhavan**
Front-End Developer | React | TypeScript


---

## 📄 License

This project is for educational/demo purposes under the MIT License.
