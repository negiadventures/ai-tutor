import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default function QuizViewer({ quiz, chapterNumber, book }) {
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [loadingNewQuiz, setLoadingNewQuiz] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (quiz?.questions?.length) {
      pickRandomFive(quiz.questions);
    }
  }, [quiz]);

  const pickRandomFive = (allQuestions) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    setVisibleQuestions(selected);
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    setError(null);
  };

  const handleOptionSelect = (questionIdx, option) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIdx]: option,
    }));
  };

  const handleSubmit = () => {
    setSubmitting(true);
    let calculatedScore = 0;

    visibleQuestions.forEach((q, idx) => {
      const userAnswer = (userAnswers[idx] || '').trim();
      const correctAnswer = (q.answer || q.answer_text || '').trim();

      if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
    setSubmitting(false);
  };

  const regenerateQuiz = async () => {
    if (!book || chapterNumber == null) return;
    setError(null);
    try {
      setLoadingNewQuiz(true);
      const res = await axios.post(
        `${API_BASE}/generate-quiz/?book=${encodeURIComponent(book)}&chapter_number=${chapterNumber}`
      );
      pickRandomFive(res.data.questions);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to regenerate quiz.';
      setError(detail);
    } finally {
      setLoadingNewQuiz(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🧠 Generated Quiz</h2>
        <button
          onClick={regenerateQuiz}
          disabled={loadingNewQuiz}
          className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {loadingNewQuiz ? 'Loading...' : 'Generate New Quiz'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">⚠️ {error}</p>}

      <ul className="space-y-6">
        {visibleQuestions.map((q, idx) => {
          const correctAnswer = q.answer || q.answer_text;
          const userAnswer = userAnswers[idx];
          const isCorrect =
            submitted &&
            userAnswer &&
            userAnswer.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();

          return (
            <li
              key={idx}
              className={`bg-gray-50 p-4 rounded border ${
                submitted
                  ? isCorrect
                    ? 'border-green-500'
                    : 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <p className="font-medium mb-1">
                Q{idx + 1} ({q.type || q.question_type}): {q.question || q.question_text}
              </p>

              {q.options?.length ? (
                <ul className="list-none ml-4 text-sm text-gray-700">
                  {q.options.map((opt, i) => (
                    <li key={i} className="mb-1">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`question-${idx}`}
                          value={opt}
                          disabled={submitted}
                          checked={userAnswers[idx] === opt}
                          onChange={() => handleOptionSelect(idx, opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <textarea
                  rows={3}
                  placeholder="Type your answer here..."
                  value={userAnswers[idx] || ''}
                  disabled={submitted}
                  onChange={(e) => handleOptionSelect(idx, e.target.value)}
                  className="w-full p-2 mt-2 border rounded"
                />
              )}

              {submitted && (
                <div
                  className={`mt-2 text-sm font-semibold ${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isCorrect ? '✅ Correct' : '❌ Wrong'}
                  <div className="text-gray-700">Answer: {correctAnswer}</div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      ) : (
        <div className="mt-6 text-lg font-bold text-purple-700">
          🎯 Your Score: {score} / {visibleQuestions.length}
        </div>
      )}
    </div>
  );
}