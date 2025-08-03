CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT,
    question_text TEXT,
    answer_text TEXT,
    question_type VARCHAR(100),
    difficulty VARCHAR(50),
    options JSON,
    FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);