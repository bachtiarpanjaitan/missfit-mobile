import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Answer {
  id: string;
  text: string;
  image?: string;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  answers: Answer[];
  correctAnswerId: string;
  explanation: string;
}

export interface QuizPackage {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  price: number;
  isFree: boolean;
  questionCount: number;
  duration: number;
  rating: number;
  maxAttempts: number;
  totalAttempts?: number;
  isPurchased?: boolean;
  image?: string;
  createdAt: string;
}

export interface QuizResult {
  id: string;
  packageId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; answerId: string }[];
  completedAt: string;
}

export interface QuizState {
  packages: QuizPackage[];
  myPackages: QuizPackage[];
  currentQuiz: {
    package: QuizPackage | null;
    questions: Question[];
    currentQuestionIndex: number;
    answers: { [questionId: string]: string };
    startTime: number | null;
  };
  results: QuizResult[];
  latestPackages: QuizPackage[];
  freePackages: QuizPackage[];
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  packages: [],
  myPackages: [],
  currentQuiz: {
    package: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    startTime: null,
  },
  results: [],
  latestPackages: [],
  freePackages: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchQuizPackages = createAsyncThunk(
  'quiz/fetchPackages',
  async () => {
    const response = await api.get('/quizzes');
    return response.data.data;
  }
);

export const fetchMyQuizPackages = createAsyncThunk(
  'quiz/fetchMyPackages',
  async () => {
    const response = await api.get('/quizzes/my-packages');
    return response.data.data;
  }
);

export const fetchQuizDetails = createAsyncThunk(
  'quiz/fetchDetails',
  async (packageId: string) => {
    const response = await api.get(`/quizzes/${packageId}`);
    return response.data.data;
  }
);

export const fetchQuizQuestions = createAsyncThunk(
  'quiz/fetchQuestions',
  async (packageId: string) => {
    const response = await api.get(`/quizzes/${packageId}/questions`);
    return response.data.data;
  }
);

export const submitQuizAnswer = createAsyncThunk(
  'quiz/submitAnswer',
  async (data: { packageId: string; questionId: string; answerId: string }) => {
    const response = await api.post('/quizzes/submit-answer', data);
    return response.data.data;
  }
);

export const submitQuizResult = createAsyncThunk(
  'quiz/submitResult',
  async (data: {
    packageId: string;
    score: number;
    totalQuestions: number;
    timeSpent: number;
    answers: { questionId: string; answerId: string }[];
  }) => {
    const response = await api.post('/quizzes/submit-result', data);
    return response.data.data;
  }
);

export const fetchQuizResults = createAsyncThunk(
  'quiz/fetchResults',
  async () => {
    const response = await api.get('/quizzes/my-results');
    return response.data.data;
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action) => {
      state.currentQuiz = {
        package: action.payload,
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        startTime: Date.now(),
      };
    },
    answerQuestion: (state, action) => {
      const { questionId, answerId } = action.payload;
      state.currentQuiz.answers[questionId] = answerId;
    },
    moveToNextQuestion: (state) => {
      state.currentQuiz.currentQuestionIndex += 1;
    },
    moveToPreviousQuestion: (state) => {
      if (state.currentQuiz.currentQuestionIndex > 0) {
        state.currentQuiz.currentQuestionIndex -= 1;
      }
    },
    resetQuiz: (state) => {
      state.currentQuiz = {
        package: null,
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        startTime: null,
      };
    },
    setQuestions: (state, action) => {
      state.currentQuiz.questions = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchQuizPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch packages';
      })
      .addCase(fetchMyQuizPackages.fulfilled, (state, action) => {
        state.myPackages = action.payload;
      })
      .addCase(fetchQuizQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz.questions = action.payload;
      })
      .addCase(fetchQuizQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch questions';
      })
      .addCase(fetchQuizResults.fulfilled, (state, action) => {
        state.results = action.payload;
      })
      .addCase(submitQuizResult.fulfilled, (state, action) => {
        state.results.push(action.payload);
        state.currentQuiz = {
          package: null,
          questions: [],
          currentQuestionIndex: 0,
          answers: {},
          startTime: null,
        };
      });
  },
});

export const {
  startQuiz,
  answerQuestion,
  moveToNextQuestion,
  moveToPreviousQuestion,
  resetQuiz,
  setQuestions,
  clearError,
} = quizSlice.actions;
export default quizSlice.reducer;
