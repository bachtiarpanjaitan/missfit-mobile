# Miss Fit - Quiz Application

A comprehensive React Native quiz application for both Android and iOS with real-time rankings, user authentication, payment integration, and advanced quiz features.

## Features

### Authentication
- Email/Password login and registration
- Google OAuth integration support
- Secure session management with JWT tokens
- Auto-refresh token mechanism

### Quiz Features
- Multiple quiz packages (Free & Paid)
- Image support in questions and answers
- 4-5 multiple choice questions
- Answer explanations after submission
- Configurable maximum attempts per package
- Quiz timer and progress tracking

### User Dashboard
- Latest quiz packages display
- Free quiz section
- Top 10 global rankings preview
- User statistics (points, quizzes taken)

### Quiz Packages
- Browse all available quizzes
- Filter by free/paid
- Search functionality
- Difficulty levels (Easy, Medium, Hard)
- Package details with ratings

### My Quizzes
- Purchased packages list
- Quiz statistics (best score, average score, attempts)
- Attempt tracking with limits
- Quick start functionality

### Rankings System
- Global rankings (Top 50)
- Per-package rankings
- User's current rank display
- Points-based ranking

### Profile Management
- Edit user information
- Avatar upload
- View user statistics
- Account settings
- Logout functionality

### Payments
- Multiple payment methods:
  - Dana
  - GoPay
  - OVO
  - LinkAja
  - Credit/Debit Card
- Secure payment processing
- Payment history tracking

## Project Structure

```
miss-fit/
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── main/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── PackagesScreen.tsx
│   │   │   ├── MyQuizzesScreen.tsx
│   │   │   ├── RankingsScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── quiz/
│   │       ├── QuizTakingScreen.tsx
│   │       └── QuizResultsScreen.tsx
│   │   └── payment/
│   │       └── PaymentFlowScreen.tsx
│   ├── redux/
│   │   ├── store.ts
│   │   ├── hooks.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── quizSlice.ts
│   │       ├── rankingSlice.ts
│   │       └── paymentSlice.ts
│   └── services/
│       └── api.ts
├── mock-api/
│   └── server.js
├── App.tsx
├── app.json
├── package.json
├── .env
├── .env.example
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager
- Expo CLI: `npm install -g expo-cli`
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation

1. **Clone the project:**
   ```bash
   git clone <repository-url>
   cd miss-fit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start the mock API server (in a separate terminal):**
   ```bash
   npm run mock-api
   ```

   The mock API will run on `http://localhost:3001/api`

5. **Start the React Native development server:**
   ```bash
   npm start
   ```

6. **Run on specific platform:**
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios

   # For Web
   npm run web
   ```

## Environment Variables

Configure your `.env` file with the following variables:

```
# API Configuration
API_BASE_URL=http://localhost:3001/api
API_TIMEOUT=30000

# Firebase Configuration (for Google Auth)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe Configuration for Payments
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_MERCHANT_ID=your_stripe_merchant_id

# App Configuration
APP_ENV=development
LOG_LEVEL=debug
```

## Mock API Endpoints

The mock API server provides the following endpoints:

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Quizzes
- `GET /api/quizzes` - Get all quiz packages
- `GET /api/quizzes/:id` - Get specific quiz package
- `GET /api/quizzes/:id/questions` - Get quiz questions
- `GET /api/quizzes/my-packages` - Get user's purchased packages
- `POST /api/quizzes/submit-result` - Submit quiz result
- `GET /api/quizzes/my-results` - Get user's quiz results

### Rankings
- `GET /api/rankings/global` - Get global rankings
- `GET /api/rankings/package/:packageId` - Get package-specific rankings
- `GET /api/rankings/my-rank` - Get current user's rank

### Payments
- `POST /api/payments/initiate` - Initiate payment
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/history` - Get payment history

## API Response Structure

### Success Response
```json
{
  "status": "success",
  "data": { /* Response data */ }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Dummy Data

### Test Login Credentials
- **Email:** user@example.com
- **Password:** password123

### Sample Data Available in Mock API
- 5 Quiz Packages (mix of free and paid)
- 5 sample questions for JavaScript Fundamentals quiz
- Top 10 global users rankings
- User profile with statistics

## Key Features Implementation

### Quiz Attempt Limits
Each quiz package has a `maxAttempts` field that limits how many times a user can attempt the quiz. The system tracks attempts and prevents exceeding the limit.

### Quiz Images
Questions and answers support image URLs through the `image` field. Images are displayed using React Native's `Image` component with proper scaling.

### Answer Explanations
After selecting an answer, users can view the explanation by tapping "Show Explanation" button. The correct answer is highlighted in green, incorrect selections in red.

### Real-time Rankings
Rankings are fetched from the API and displayed with user avatars, points, and rank position. Users can view both global and per-package rankings.

### Payment Processing
The payment flow includes:
1. Method selection (Dana, GoPay, OVO, LinkAja, Card)
2. Order confirmation with package details
3. Processing simulation (2-second delay)
4. Success/failure handling with feedback

## Redux State Management

The application uses Redux Toolkit for state management with the following slices:

- **auth** - User authentication state
- **quiz** - Quiz packages, questions, and results
- **ranking** - User and global rankings
- **payment** - Payment transactions

## Navigation Structure

The app uses React Navigation with the following structure:

```
Root Navigator
├── Auth Stack (when not authenticated)
│   ├── Login
│   └── Register
└── Main Stack (when authenticated)
    ├── Main Tabs
    │   ├── Dashboard
    │   ├── Packages
    │   ├── My Quizzes
    │   ├── Rankings
    │   └── Profile
    └── Modal Screens
        ├── Quiz Taking
        ├── Payment Flow
        └── Quiz Results
```

## Styling

The application uses:
- **Colors:** Indigo (#6366f1) as primary, with grays and functional colors
- **Layout:** Flexbox-based with responsive design
- **Typography:** Clean sans-serif fonts with proper hierarchy

## Performance Optimization

- Lazy loading of quiz questions
- Memoized components to prevent unnecessary re-renders
- Efficient list rendering with FlatList
- Image caching with Expo
- Redux selectors for optimal state subscriptions

## Security Considerations

- JWT tokens stored in AsyncStorage
- Auto-refresh token mechanism on 401 responses
- Input validation on all forms
- CORS-enabled mock API for development
- Secure payment processing (mock implementation)

## Future Enhancements

- Offline mode support with local caching
- Real-time collaboration features
- Advanced analytics dashboard
- Certificate generation
- Social sharing integration
- Push notifications for new quizzes
- Video/audio question support

## Troubleshooting

### API Connection Issues
- Ensure mock API is running: `npm run mock-api`
- Check `API_BASE_URL` in `.env` matches the mock API URL
- Verify network connectivity

### Build Issues
- Clear cache: `npm start -- --clear`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo CLI: `npm install -g expo-cli@latest`

### iOS Specific
- Run: `cd ios && pod install && cd ..`
- Xcode version compatibility issues

### Android Specific
- Ensure Android SDK is properly installed
- Update Android build tools
- Clear Android build cache: `cd android && ./gradlew clean && cd ..`

## Contributing

1. Create a new branch for features
2. Follow the existing code structure
3. Use TypeScript for type safety
4. Test on both platforms before submitting

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For questions or issues, please open an issue in the repository.

## Contact

Miss Fit Development Team
