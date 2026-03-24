import axios from 'axios';
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function ChapterList({ book, chapters, onQuizReady }) {
  const [loadingChapterIndex, setLoadingChapterIndex] = useState(null);
  const [error, setError] = useState(null);

  const generateQuiz = async (chapterIndex) => {
    setLoadingChapterIndex(chapterIndex);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/generate-quiz/?book=${encodeURIComponent(book)}&chapter_number=${chapterIndex + 1}`);
      onQuizReady(res.data, chapterIndex + 1);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to generate quiz.';
      setError(detail);
    } finally {
      setLoadingChapterIndex(null);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">📘 Detected Chapters</h2>
      {error && <p className="mb-2 text-sm text-red-600">⚠️ {error}</p>}
      <ul className="space-y-2">
        {chapters.map((chapter, index) => (
          <li key={index} className="bg-white p-4 rounded shadow border flex justify-between items-center">
            <span className="truncate max-w-[75%]">
              {chapter.chapter_title || chapter.title || `Chapter ${index + 1}`}
            </span>
            <button
              onClick={() => generateQuiz(index)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loadingChapterIndex !== null}
            >
              {loadingChapterIndex === index ? 'Generating...' : 'Generate Quiz'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}