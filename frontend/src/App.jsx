import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ChapterList from './components/ChapterList';
import QuizViewer from './components/QuizViewer';

function App() {
  const [documentId, setDocumentId] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [book, setBook] = useState(null);
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(null);

  const handleUpload = (data) => {
    setDocumentId(data.document_id);
    setBook(data.book);
    setChapters(data.chapters || []);
    setQuiz(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-2xl font-bold text-center mb-8">📚 AI Tutor – Smart Quiz Generator</header>
      <div className="max-w-4xl mx-auto">
        <FileUpload onChaptersDetected={handleUpload} />

        {chapters.length === 0 && !quiz && (
          <p className="text-center text-gray-500 mt-4">Upload a PDF or Word file to get started.</p>
        )}

        {chapters.length > 0 && (
          <ChapterList
            documentId={documentId}
            book={book}
            chapters={chapters}
            onQuizReady={(quizData, chapterNum) => {
              setQuiz(quizData);
              setSelectedChapterNumber(chapterNum);
            }}
          />
        )}

        {quiz && (
          <QuizViewer
            quiz={quiz}
            chapterNumber={selectedChapterNumber}
            book={book}
          />
        )}
      </div>
      <footer className="text-center text-sm text-gray-500 mt-10">
        &copy; {new Date().getFullYear()} AI Tutor
      </footer>
    </div>
  );
}


export default App;
