
# 📚 AI Tutor – Smart Quiz Generator

This project is an AI-powered educational tool designed to convert PDF/Word study materials into intelligent chapter-wise quizzes. It leverages NLP and vector embedding techniques to detect chapters, generate quizzes, and evaluate answers automatically.

## 🖼️ Screenshots

### 📘 Chapter Detection UI
![Chapter Detection UI](./assets/1.png)

### 🧠 Generated Quiz UI
![Generated Quiz](./assets/2.png)

---

## 💡 Summary

- Upload any textbook (PDF/Word)
- Automatically splits it into chapters (e.g., Unit 1, Unit 2...)
- Click "Generate Quiz" for any unit to receive 5 AI-generated questions (MCQ/Subjective)
- Submit answers and receive automatic feedback and score

---

## 🚀 How to Run

### 📦 Prerequisites

- Python 3.10+
- Node.js 18+
- Docker (for container-based deployment)
- Optional: HuggingFace transformer models locally cached

### 🛠️ Backend

```bash
cd backend
pip install -r requirements.txt
```
- If you are running mysql locally, to make sure you connect from your docker to local mysql, you need to create a network and host for db should be host.docker.internal
- Also Make sure tables exists, run all the ddls from ddl dir. 
- Update creds in .env file

```
docker network create ai-network 
docker-compose up --build
```

### 🧑‍💻 Frontend

```bash
cd frontend
yarn install
yarn dev
```

Open: [http://localhost:5173](http://localhost:5173)

---


## 📄 License
MIT
