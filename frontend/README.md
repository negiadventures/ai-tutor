# 🖥️ AI Tutor – Frontend

This is the React-based UI for:
- Uploading course materials (PDF or DOCX)
- Visualizing detected chapters
- Triggering quiz generation per chapter
- Interactively answering AI-generated quizzes and viewing scores

## 🧰 Stack

- React + Vite
- TailwindCSS
- Axios for API communication
- Vitest + Testing Library for unit tests

## ⚙️ Setup

```bash
cd frontend
cp .env.example .env          # set VITE_API_BASE_URL=http://localhost:8000
npm install                   # or: yarn install
npm run dev                   # or: yarn dev
```

App runs at: [http://localhost:5173](http://localhost:5173)

## 🌐 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:8000`) |

Copy `.env.example` to `.env` and set the value before running.

## 🧪 Running Tests

```bash
npm test
```

9 unit tests cover `ChapterList` and `QuizViewer` components.

## 📁 Notable Components

- `App.jsx` – File upload, document state, main routing
- `ChapterList.jsx` – Lists extracted chapters, triggers quiz generation
- `QuizViewer.jsx` – Displays and submits AI-generated quizzes