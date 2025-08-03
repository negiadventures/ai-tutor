import axios from 'axios';
import { useState } from 'react';

export default function ChapterList({ book, chapters, onQuizReady }) {
  const [loadingChapterIndex, setLoadingChapterIndex] = useState(null);

  const generateQuiz = async (chapterIndex) => {
    setLoadingChapterIndex(chapterIndex);
    try {
      const res = await axios.post(`http://localhost:8000/generate-quiz/?book=${encodeURIComponent(book)}&chapter_number=${chapterIndex + 1}`);
      onQuizReady(res.data, chapterIndex + 1);
    } catch (err) {
      alert('Failed to generate quiz');
    } finally {
      setLoadingChapterIndex(null);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">📘 Detected Chapters</h2>
      <ul className="space-y-2">
        {chapters.map((chapter, index) => (
          <li key={index} className="bg-white p-4 rounded shadow border flex justify-between items-center">
            <span className="truncate max-w-[75%]">
  {chapter.chapter_title || `Chapter ${index + 1}`}
</span>
            <button
              onClick={() => generateQuiz(index)}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              disabled={loadingChapterIndex === index}
            >
              {loadingChapterIndex === index ? 'Generating...' : 'Generate Quiz'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}