const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
const users = {
  'user@example.com': {
    id: 'user-1',
    email: 'user@example.com',
    name: 'John Doe',
    password: 'password123',
    avatar: 'https://i.pravatar.cc/150?img=1',
    points: 2450,
    totalQuizzesTaken: 12,
    createdAt: '2024-01-15',
  },
};

const quizzes = [
  {
    id: 'quiz-1',
    title: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming',
    category: 'Programming',
    difficulty: 'easy',
    price: 0,
    isFree: true,
    questionCount: 10,
    duration: 20,
    rating: 4.8,
    maxAttempts: 5,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    createdAt: '2024-01-20',
  },
  {
    id: 'quiz-2',
    title: 'React Advanced Concepts',
    description: 'Master React hooks, context, and performance optimization',
    category: 'Web Development',
    difficulty: 'hard',
    price: 9.99,
    isFree: false,
    questionCount: 25,
    duration: 60,
    rating: 4.9,
    maxAttempts: 3,
    image: 'https://images.unsplash.com/photo-1633356122544-f134ef2944f5?w=400&h=300&fit=crop',
    createdAt: '2024-01-18',
  },
  {
    id: 'quiz-3',
    title: 'Python Data Science',
    description: 'Introduction to data analysis with Python',
    category: 'Data Science',
    difficulty: 'medium',
    price: 14.99,
    isFree: false,
    questionCount: 30,
    duration: 90,
    rating: 4.7,
    maxAttempts: 4,
    image: 'https://images.unsplash.com/photo-1526374965328-7f5ae4e8b08f?w=400&h=300&fit=crop',
    createdAt: '2024-01-17',
  },
  {
    id: 'quiz-4',
    title: 'CSS Mastery',
    description: 'Everything about CSS styling and animations',
    category: 'Web Design',
    difficulty: 'easy',
    price: 0,
    isFree: true,
    questionCount: 15,
    duration: 30,
    rating: 4.6,
    maxAttempts: 5,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    createdAt: '2024-01-16',
  },
  {
    id: 'quiz-5',
    title: 'Database Design',
    description: 'SQL and NoSQL database fundamentals',
    category: 'Databases',
    difficulty: 'medium',
    price: 12.99,
    isFree: false,
    questionCount: 20,
    duration: 45,
    rating: 4.8,
    maxAttempts: 4,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    createdAt: '2024-01-15',
  },
];

const questions = {
  'quiz-1': [
    {
      id: 'q1-1',
      text: 'What is a variable in JavaScript?',
      image: null,
      answers: [
        { id: 'a1', text: 'A named storage location for data', image: null },
        { id: 'a2', text: 'A function parameter', image: null },
        { id: 'a3', text: 'A CSS property', image: null },
        { id: 'a4', text: 'An HTML tag', image: null },
      ],
      correctAnswerId: 'a1',
      explanation:
        'A variable is a named container for storing data values. In JavaScript, you can declare variables using var, let, or const.',
    },
    {
      id: 'q1-2',
      text: 'Which keyword is used to declare a variable that cannot be reassigned?',
      image: null,
      answers: [
        { id: 'a1', text: 'var', image: null },
        { id: 'a2', text: 'let', image: null },
        { id: 'a3', text: 'const', image: null },
        { id: 'a4', text: 'static', image: null },
      ],
      correctAnswerId: 'a3',
      explanation:
        'The const keyword declares a variable that cannot be reassigned. However, if it holds an object or array, its properties or elements can still be modified.',
    },
    {
      id: 'q1-3',
      text: 'What is the result of 5 + "5" in JavaScript?',
      image: null,
      answers: [
        { id: 'a1', text: '10', image: null },
        { id: 'a2', text: '"55"', image: null },
        { id: 'a3', text: 'NaN', image: null },
        { id: 'a4', text: 'undefined', image: null },
      ],
      correctAnswerId: 'a2',
      explanation:
        'JavaScript will perform type coercion. When you add a number and a string, the number is converted to a string, resulting in "55".',
    },
    {
      id: 'q1-4',
      text: 'What is a closure in JavaScript?',
      image: null,
      answers: [
        { id: 'a1', text: 'A function that closes', image: null },
        { id: 'a2', text: 'A function with access to outer scope variables', image: null },
        { id: 'a3', text: 'A way to end a program', image: null },
        { id: 'a4', text: 'A variable that cannot be changed', image: null },
      ],
      correctAnswerId: 'a2',
      explanation:
        'A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function has returned.',
    },
    {
      id: 'q1-5',
      text: 'Which method adds elements to the end of an array?',
      image: null,
      answers: [
        { id: 'a1', text: 'push()', image: null },
        { id: 'a2', text: 'pop()', image: null },
        { id: 'a3', text: 'shift()', image: null },
        { id: 'a4', text: 'unshift()', image: null },
      ],
      correctAnswerId: 'a1',
      explanation:
        'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
    },
  ],
};

const rankings = [
  { userId: 'user-1', userName: 'John Doe', userAvatar: 'https://i.pravatar.cc/150?img=1', points: 2450, quizzesTaken: 12, rank: 1 },
  { userId: 'user-2', userName: 'Jane Smith', userAvatar: 'https://i.pravatar.cc/150?img=2', points: 2200, quizzesTaken: 10, rank: 2 },
  { userId: 'user-3', userName: 'Mike Johnson', userAvatar: 'https://i.pravatar.cc/150?img=3', points: 1950, quizzesTaken: 9, rank: 3 },
  { userId: 'user-4', userName: 'Sarah Williams', userAvatar: 'https://i.pravatar.cc/150?img=4', points: 1800, quizzesTaken: 8, rank: 4 },
  { userId: 'user-5', userName: 'Tom Brown', userAvatar: 'https://i.pravatar.cc/150?img=5', points: 1650, quizzesTaken: 7, rank: 5 },
  { userId: 'user-6', userName: 'Emily Davis', userAvatar: 'https://i.pravatar.cc/150?img=6', points: 1500, quizzesTaken: 6, rank: 6 },
  { userId: 'user-7', userName: 'David Miller', userAvatar: 'https://i.pravatar.cc/150?img=7', points: 1350, quizzesTaken: 5, rank: 7 },
  { userId: 'user-8', userName: 'Lisa Anderson', userAvatar: 'https://i.pravatar.cc/150?img=8', points: 1200, quizzesTaken: 4, rank: 8 },
  { userId: 'user-9', userName: 'Chris Taylor', userAvatar: 'https://i.pravatar.cc/150?img=9', points: 1050, quizzesTaken: 3, rank: 9 },
  { userId: 'user-10', userName: 'Emma Thomas', userAvatar: 'https://i.pravatar.cc/150?img=10', points: 900, quizzesTaken: 2, rank: 10 },
];

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  console.log({req})
  const { email, password } = req.body;
  const user = users[email];

  if (user && user.password === password) {
    res.json({
      status: 'success',
      data: {
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          points: user.points,
          totalQuizzesTaken: user.totalQuizzesTaken,
          createdAt: user.createdAt,
        },
      },
    });
  } else {
    res.status(401).json({
      status: 'error',
      message: 'Invalid credentials',
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, name, password } = req.body;

  if (users[email]) {
    return res.status(409).json({
      status: 'error',
      message: 'Email already registered',
    });
  }

  const newUser = {
    id: 'user-' + Date.now(),
    email,
    name,
    password,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 100)}`,
    points: 0,
    totalQuizzesTaken: 0,
    createdAt: new Date().toISOString(),
  };

  users[email] = newUser;

  res.status(201).json({
    status: 'success',
    data: {
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        points: newUser.points,
        totalQuizzesTaken: newUser.totalQuizzesTaken,
        createdAt: newUser.createdAt,
      },
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock auth check
  const user = users['user@example.com'];
  res.json({
    status: 'success',
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      points: user.points,
      totalQuizzesTaken: user.totalQuizzesTaken,
      createdAt: user.createdAt,
    },
  });
});

app.put('/api/auth/profile', (req, res) => {
  const { name, avatar } = req.body;
  const user = users['user@example.com'];

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;

  res.json({
    status: 'success',
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      points: user.points,
      totalQuizzesTaken: user.totalQuizzesTaken,
      createdAt: user.createdAt,
    },
  });
});

// Quiz Routes
app.get('/api/quizzes', (req, res) => {
  res.json({
    status: 'success',
    data: quizzes,
  });
});

app.get('/api/quizzes/:id', (req, res) => {
  const quiz = quizzes.find((q) => q.id === req.params.id);
  if (quiz) {
    res.json({
      status: 'success',
      data: quiz,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Quiz not found',
    });
  }
});

app.get('/api/quizzes/:id/questions', (req, res) => {
  const quizQuestions = questions[req.params.id];
  if (quizQuestions) {
    res.json({
      status: 'success',
      data: quizQuestions,
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Questions not found',
    });
  }
});

app.get('/api/quizzes/my-packages', (req, res) => {
  // Return first 3 quizzes as purchased
  res.json({
    status: 'success',
    data: quizzes.slice(0, 3).map((q) => ({
      ...q,
      isPurchased: true,
      totalAttempts: Math.floor(Math.random() * (q.maxAttempts + 1)),
    })),
  });
});

app.post('/api/quizzes/submit-result', (req, res) => {
  const { packageId, score, totalQuestions, timeSpent, answers } = req.body;

  const result = {
    id: 'result-' + Date.now(),
    packageId,
    score,
    totalQuestions,
    timeSpent,
    answers,
    completedAt: new Date().toISOString(),
  };

  res.json({
    status: 'success',
    data: result,
  });
});

app.get('/api/quizzes/my-results', (req, res) => {
  res.json({
    status: 'success',
    data: [
      {
        id: 'result-1',
        packageId: 'quiz-1',
        score: 85,
        totalQuestions: 10,
        timeSpent: 1200,
        answers: [],
        completedAt: '2024-01-25T10:30:00Z',
      },
      {
        id: 'result-2',
        packageId: 'quiz-1',
        score: 90,
        totalQuestions: 10,
        timeSpent: 1100,
        answers: [],
        completedAt: '2024-01-24T14:15:00Z',
      },
    ],
  });
});

// Rankings Routes
app.get('/api/rankings/global', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  res.json({
    status: 'success',
    data: rankings.slice(0, limit),
  });
});

app.get('/api/rankings/package/:packageId', (req, res) => {
  res.json({
    status: 'success',
    data: rankings.slice(0, 10),
  });
});

app.get('/api/rankings/my-rank', (req, res) => {
  res.json({
    status: 'success',
    data: rankings[0],
  });
});

// Payment Routes
app.post('/api/payments/initiate', (req, res) => {
  const { packageId, method } = req.body;

  const payment = {
    id: 'payment-' + Date.now(),
    packageId,
    userId: 'user-1',
    amount: 9.99,
    method,
    status: 'pending',
    transactionId: 'txn_' + Date.now(),
    createdAt: new Date().toISOString(),
  };

  res.json({
    status: 'success',
    data: payment,
  });
});

app.post('/api/payments/verify', (req, res) => {
  const { transactionId } = req.body;

  const payment = {
    id: 'payment-' + Date.now(),
    packageId: 'quiz-2',
    userId: 'user-1',
    amount: 9.99,
    method: 'dana',
    status: 'success',
    transactionId,
    createdAt: new Date().toISOString(),
  };

  res.json({
    status: 'success',
    data: payment,
  });
});

app.get('/api/payments/history', (req, res) => {
  res.json({
    status: 'success',
    data: [
      {
        id: 'payment-1',
        packageId: 'quiz-2',
        userId: 'user-1',
        amount: 9.99,
        method: 'dana',
        status: 'success',
        transactionId: 'txn_001',
        createdAt: '2024-01-20T10:00:00Z',
      },
    ],
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock API Server running on http://localhost:${PORT}`);
  console.log(`Start the app and make sure ${process.env.API_BASE_URL}`);
});
