import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch quiz data
export const fetchQuizData = createAsyncThunk('quiz/fetchQuizData', async () => {
  try {
    console.log('Fetching quiz data from API...');
    const response = await axios.get('/Uw5CrX'); 
    console.log('Fetched data:', response.data);

    if (!response.data || !response.data.questions) {
      throw new Error("Invalid data format: Missing 'questions' key.");
    }

    return response.data.questions;
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    return []; 
  }
});



const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    questions: [],
    currentQuestionIndex: 0,
    selectedOption: {}, 
    quizStarted: false, 
    quizSubmitted: false,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    status: 'idle',
  },
  reducers: {
    startQuiz: (state) => {
      state.quizStarted = true;
    },
    resetQuiz: (state) => {
      state.selectedOption = {};
      state.currentQuestionIndex = 0;
      state.quizStarted = false;
      state.quizSubmitted = false;
      state.score = 0;
      state.correctCount = 0;
      state.wrongCount = 0;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    selectAnswer: (state, action) => {
      const { questionIndex, selectedOption } = action.payload;
      state.selectedOption[questionIndex] = selectedOption;
    },
    submitQuiz: (state) => {
      let score = 0;
      let correctCount = 0;
      let wrongCount = 0;

      Object.keys(state.selectedOption).forEach((index) => {
        const questionIndex = parseInt(index);
        const selectedAnswerId = state.selectedOption[questionIndex];

        if (selectedAnswerId) {
          const selectedOption = state.questions[questionIndex].options.find(option => option.id === selectedAnswerId);

          if (selectedOption && selectedOption.is_correct) {
            score += 4; 
            correctCount++;
          } else {
            score -= 1;  
            wrongCount++;
          }
        }
      });

      state.correctCount = correctCount;
      state.wrongCount = wrongCount;
      state.score = Math.max(0, score); 
      state.quizSubmitted = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizData.fulfilled, (state, action) => {
        console.log('Received quiz data:', action.payload);
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(fetchQuizData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { startQuiz, nextQuestion, previousQuestion, selectAnswer, submitQuiz, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
