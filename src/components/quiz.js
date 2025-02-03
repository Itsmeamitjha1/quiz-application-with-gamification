import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizData, nextQuestion, previousQuestion, selectAnswer, submitQuiz, resetQuiz } from '../features/quiz/quizSlice';
import QuizBanner from '../assets/Quiz-banner.jpg';
import './quiz.css';

const Quiz = () => {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, status, selectedOption, quizSubmitted, score, correctCount, wrongCount } = useSelector((state) => state.quiz);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    dispatch(fetchQuizData());
  }, [dispatch]);

  const restartQuiz = () => {
    setQuizStarted(false);
    dispatch(resetQuiz());
    dispatch(fetchQuizData());
  };

  if (!quizStarted) {
    return (
      <div className="quiz-banner-container">
        <img src={QuizBanner} alt="Quiz Banner" className="quiz-banner-image" />
        <h1>Welcome to the Quiz</h1>
        <button className="start-btn" onClick={() => setQuizStarted(true)}>Start Quiz</button>
      </div>
    );
  }

  if (status === 'loading') return <p>Loading quiz data...</p>;
  if (status === 'failed') return <p>Error loading quiz data. Please try again later.</p>;
  if (!questions || questions.length === 0) return <p>No questions available.</p>;

  if (quizSubmitted) {
    return (
      <div className="quiz-container">
        <h1>Quiz Complete!</h1>
        <p>Your Score: {score}</p>
        <p>You attempted: {correctCount + wrongCount} / {questions.length} questions</p>
        <p>Correct Answers: {correctCount} / {correctCount + wrongCount}</p>
        <p>Wrong Answers: {wrongCount} / {correctCount + wrongCount}</p>
        <button className="start-btn" onClick={restartQuiz}>Restart Quiz</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="question-card">
        <p className="question-text">{currentQuestion.description}</p>
        <div className="options-grid">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption[currentQuestionIndex] === option.id;
            return (
              <button
                key={option.id}
                className={`option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => dispatch(selectAnswer({ questionIndex: currentQuestionIndex, selectedOption: option.id }))}>
                {option.description}
              </button>
            );
          })}
        </div>
      </div>

      <div className="navigation-container">
        <button className="nav-btn" onClick={() => dispatch(previousQuestion())} disabled={currentQuestionIndex === 0 || quizSubmitted}>
          Previous
        </button>
        <span className="question-tracker">{currentQuestionIndex + 1} / {questions.length}</span>
        <button className="nav-btn" onClick={() => dispatch(nextQuestion())} disabled={currentQuestionIndex === questions.length - 1 || quizSubmitted}>
          Next
        </button>
      </div>

      <button className="submit-btn" onClick={() => dispatch(submitQuiz())} disabled={Object.keys(selectedOption).length === 0 || quizSubmitted}>
        Submit
      </button>
    </div>
  );
};

export default Quiz;

