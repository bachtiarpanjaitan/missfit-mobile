# Miss Fit - Quick Reference Guide

Quick lookup guide for common tasks and frequently needed information.

## Getting Started (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Terminal 1: Start mock API
npm run mock-api

# 3. Terminal 2: Start Expo
npm start

# 4. Terminal 2: Choose platform
# Press 'a' for Android, 'i' for iOS, 'w' for web
```

## Test Credentials

```
Email: user@example.com
Password: password123
```

## Common Commands

### Development
```bash
npm start              # Start Expo dev server
npm run mock-api       # Start mock API server
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run web           # Run on web browser
```

### Building
```bash
npm run build         # Build for production
npm run build:android # Build Android APK
npm run build:ios     # Build iOS IPA
```

### Maintenance
```bash
npm update            # Update dependencies
npm install           # Install dependencies
npm uninstall <pkg>   # Uninstall package
npm list              # List installed packages
```

## Project Structure Quick Map

```
src/
├── navigation/        → RootNavigator.tsx, AuthNavigator, MainNavigator
├── screens/
│   ├── auth/         → LoginScreen, RegisterScreen
│   ├── main/         → DashboardScreen, PackagesScreen, MyQuizzesScreen, etc.
│   ├── quiz/         → QuizTakingScreen, QuizResultsScreen
│   └── payment/      → PaymentFlowScreen
├── redux/
│   ├── store.ts      → Redux store configuration
│   ├── hooks.ts      → useAppDispatch, useAppSelector
│   └── slices/       → authSlice, quizSlice, rankingSlice, paymentSlice
├── services/
│   └── api.ts        → Axios configuration and API methods
└── index.ts          → Barrel exports

mock-api/
└── server.js         → Express mock API server

App.tsx               → Application entry point
app.json              → Expo configuration
```

## API Quick Reference

### Authentication
```
POST /auth/login              → Get JWT token
POST /auth/register           → Create account
GET /auth/me                  → Get user profile
PUT /auth/profile             → Update profile
```

### Quizzes
```
GET /quizzes                  → List all quizzes
GET /quizzes/:id              → Get quiz details
GET /quizzes/:id/questions    → Get quiz questions
GET /quizzes/my-packages      → Get purchased quizzes
POST /quizzes/submit-result   → Submit quiz result
GET /quizzes/my-results       → Get quiz history
```

### Rankings
```
GET /rankings/global          → Top 50 global users
GET /rankings/package/:id     → Top users for a package
GET /rankings/my-rank         → Current user's rank
```

### Payments
```
POST /payments/initiate       → Start payment
POST /payments/verify         → Verify payment
GET /payments/history         → Payment history
POST /payments/cancel         → Cancel payment
```

## Redux Dispatch Examples

### Authentication
```typescript
import { setUser, setToken } from '@/redux/slices/authSlice';

dispatch(setUser(userData));
dispatch(setToken(jwtToken));
```

### Quiz Management
```typescript
import { setQuizzes, setCurrentQuiz } from '@/redux/slices/quizSlice';

dispatch(setQuizzes(quizPackages));
dispatch(setCurrentQuiz(quiz));
```

### Rankings
```typescript
import { setGlobalRankings, setUserRank } from '@/redux/slices/rankingSlice';

dispatch(setGlobalRankings(rankings));
dispatch(setUserRank(userRank));
```

### Payments
```typescript
import { addPayment, setCurrentPayment } from '@/redux/slices/paymentSlice';

dispatch(addPayment(payment));
dispatch(setCurrentPayment(payment));
```

## Redux Selector Examples

```typescript
import { useAppSelector } from '@/redux/hooks';

// Auth
const user = useAppSelector(state => state.auth.user);
const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

// Quiz
const quizzes = useAppSelector(state => state.quiz.packages);
const currentQuiz = useAppSelector(state => state.quiz.currentQuiz);

// Ranking
const globalRankings = useAppSelector(state => state.ranking.globalRankings);
const myRank = useAppSelector(state => state.ranking.userRank);

// Payment
const payments = useAppSelector(state => state.payment.payments);
```

## Common Hooks

```typescript
// Redux
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// Navigation
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

// React
import { useState, useEffect, useCallback } from 'react';

// Example usage in a screen
function MyScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const user = useAppSelector(state => state.auth.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Component logic
  }, []);

  return (
    // JSX
  );
}
```

## Navigation Examples

### Navigate to Screen
```typescript
navigation.navigate('Dashboard');
navigation.navigate('Quiz', { packageId: 'quiz-1' });
```

### Go Back
```typescript
navigation.goBack();
navigation.canGoBack() && navigation.goBack();
```

### Reset Navigation Stack
```typescript
navigation.reset({
  index: 0,
  routes: [{ name: 'Dashboard' }],
});
```

## API Call Examples

### Login
```typescript
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

const { token, user } = response.data.data;
dispatch(setToken(token));
dispatch(setUser(user));
```

### Get Quizzes
```typescript
const response = await api.get('/quizzes', {
  params: { difficulty: 'easy' }
});

dispatch(setQuizzes(response.data.data));
```

### Submit Quiz Result
```typescript
const response = await api.post('/quizzes/submit-result', {
  packageId: 'quiz-1',
  score: 85,
  totalQuestions: 10,
  timeSpent: 1200,
  answers: [...answers]
});
```

## Styling Quick Reference

### Common Styles
```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#6366f1',
  },
});
```

### Layout Patterns
```typescript
// Flex Container
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  {/* content */}
</View>

// Row Layout
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  {/* items */}
</View>

// Card
<View style={{ borderRadius: 8, backgroundColor: '#fff', padding: 16 }}>
  {/* content */}
</View>
```

## Environment Variables

```
# .env file
API_BASE_URL=http://localhost:3001/api
API_TIMEOUT=30000
APP_ENV=development
LOG_LEVEL=debug
```

## Colors

### Primary Colors
- **Indigo:** `#6366f1`
- **Indigo Light:** `#eef2ff`
- **Indigo Dark:** `#4f46e5`

### Semantic Colors
- **Success:** `#10b981`
- **Error:** `#ef4444`
- **Warning:** `#f59e0b`
- **Info:** `#3b82f6`

### Grays
- **White:** `#ffffff`
- **Gray 100:** `#f3f4f6`
- **Gray 500:** `#6b7280`
- **Gray 800:** `#1f2937`
- **Black:** `#000000`

## Screen Parameters

### Quiz Taking Screen
```typescript
navigation.navigate('QuizTaking', {
  packageId: 'quiz-1',
  title: 'JavaScript Fundamentals'
});
```

### Payment Flow Screen
```typescript
navigation.navigate('PaymentFlow', {
  packageId: 'quiz-2',
  packageTitle: 'Advanced React',
  price: 9.99
});
```

### Quiz Results Screen
```typescript
navigation.navigate('QuizResults', {
  result: quizResult,
  packageId: 'quiz-1'
});
```

## Debugging Tips

### Console Logging
```typescript
console.log('Value:', value);
console.warn('Warning:', message);
console.error('Error:', error);
```

### Redux DevTools
```typescript
// Enable in Redux store configuration
// Access at: http://localhost:8081/redux-devtools
```

### Expo DevTools
```bash
# Open devtools
npm start
# Press 'j' for debugger options
```

### Network Debugging
```typescript
// Check API calls in Network tab
// Use Thunder Client or Postman for API testing
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Network request failed" | API not running | `npm run mock-api` |
| "Module not found" | Missing dependencies | `npm install` |
| Blank screen | Component error | Check console logs |
| "Port already in use" | Another process | Kill process or use different port |
| Types error in IDE | TypeScript cache | Restart IDE or `npx tsc --noEmit` |
| API URL mismatch | Wrong API_BASE_URL | Update `.env` file |

## File Size Budget

- **Bundle Size:** < 30MB target
- **Image Assets:** < 1MB per image
- **API Response:** < 5MB per request

## Performance Checklist

- [ ] Images optimized and properly sized
- [ ] Heavy computations moved to useCallback
- [ ] Unnecessary re-renders eliminated
- [ ] Large lists use FlatList
- [ ] Redux selectors are memoized
- [ ] Network requests are cached when possible

## Deployment Checklist

- [ ] .env updated for production
- [ ] API endpoints pointed to production
- [ ] Environment variables set in Expo
- [ ] Bundle size analyzed and optimized
- [ ] Tested on real devices
- [ ] App icons and splash screens updated
- [ ] Privacy policy and terms updated
- [ ] Crash reporting configured

## Version Info

```
React: 18.2.0
React Native: 0.73.0
Expo: 50.0.0+
Redux: @reduxjs/toolkit 1.9.0+
TypeScript: 5.2.2
```

## External Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)

### Useful Tools
- **Postman:** API testing
- **Thunder Client:** VS Code API client
- **React DevTools:** Debugging
- **TypeScript Playground:** Type checking

### Community
- [Stack Overflow](https://stackoverflow.com)
- [Expo Forums](https://forums.expo.dev)
- [React Native Community](https://github.com/react-native-community)

## Key File Locations

| What | Where |
|------|-------|
| Navigation setup | `src/navigation/RootNavigator.tsx` |
| Redux store | `src/redux/store.ts` |
| API client | `src/services/api.ts` |
| Auth slice | `src/redux/slices/authSlice.ts` |
| Quiz slice | `src/redux/slices/quizSlice.ts` |
| Mock API | `mock-api/server.js` |
| App config | `app.json` |
| Environment | `.env` |

## Quick Troubleshooting Flowchart

```
App not starting?
├─ Check npm install → Run: npm install
├─ Check API running → Run: npm run mock-api
├─ Check .env → Verify API_BASE_URL
└─ Check ports → Kill conflicting processes

API not responding?
├─ Is server running? → npm run mock-api
├─ Correct URL? → Check API_BASE_URL in .env
├─ Network issue? → Check firewall/network
└─ For emulator? → Use 10.0.2.2 for Android

UI issues?
├─ Blank screen? → Check console for errors
├─ Styling wrong? → Review StyleSheet
├─ Component error? → Check component props
└─ State issue? → Verify Redux action dispatch
```

---

**Last Updated:** January 28, 2024
**For detailed info:** See README.md, SETUP_GUIDE.md, and API_DOCUMENTATION.md
