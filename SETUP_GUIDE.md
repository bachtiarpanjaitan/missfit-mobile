# Miss Fit Setup Guide

Complete step-by-step guide to set up and run the Miss Fit Quiz Application.

## Prerequisites

Before you start, ensure you have the following installed:

### Required Software
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Platform-Specific Requirements

#### For iOS Development
- **macOS** (Catalina or newer)
- **Xcode** 12.5 or higher
- **CocoaPods** - Install via: `sudo gem install cocoapods`
- **iPhone Simulator** or physical device

#### For Android Development
- **Android Studio** 4.1 or higher
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (API level 21 or higher)
- **Android Emulator** or physical device with USB debugging enabled

#### For Web Development
- Modern web browser (Chrome, Safari, Firefox, Edge)

## Installation Steps

### 1. Clone or Download the Project

```bash
# Using Git
git clone <repository-url>
cd miss-fit

# Or download and extract the ZIP file
cd miss-fit
```

### 2. Install Expo CLI

```bash
npm install -g expo-cli@latest
```

Verify installation:
```bash
expo --version
```

### 3. Install Project Dependencies

```bash
npm install
# or
yarn install
```

This will install all dependencies including:
- React Native
- Redux Toolkit
- React Navigation
- Axios
- And other required packages

### 4. Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
API_BASE_URL=http://localhost:3001/api
API_TIMEOUT=30000
APP_ENV=development
LOG_LEVEL=debug
```

### 5. Set Up the Mock API Server

Open a **new terminal** and run:

```bash
npm run mock-api
```

You should see:
```
Mock API Server running on http://localhost:3001
Start the app and make sure API_BASE_URL=http://localhost:3001/api
```

Keep this terminal running while developing.

## Running the Application

### Option 1: Start the Expo Development Server

In the **project directory**, run:

```bash
npm start
# or
expo start
```

This will display:
```
Starting Metro Bundler
Ready on the LAN: exp://192.168.x.x:19000
Tunnel ready on use the development build
```

### Option 2: Run on Specific Platform

#### Android
```bash
npm run android
# or
expo start --android
```

**Requirements:**
- Android Emulator running (via Android Studio)
- Or physical Android device with:
  - USB debugging enabled
  - Connected via USB or same network

#### iOS
```bash
npm run ios
# or
expo start --ios
```

**Requirements:**
- Running on macOS
- Xcode Command Line Tools installed
- iPhone Simulator running (launches automatically)
- Or physical iOS device with Expo Go app

#### Web
```bash
npm run web
# or
expo start --web
```

Opens automatically in your default browser at `http://localhost:3000`

## Development Workflow

### Terminal Setup

You'll need **2-3 terminals open**:

**Terminal 1 - Mock API Server:**
```bash
npm run mock-api
# Runs on http://localhost:3001
```

**Terminal 2 - Expo Development Server:**
```bash
npm start
# Press 'a' for Android, 'i' for iOS, 'w' for web
```

**Terminal 3 (Optional) - Debugging:**
```bash
# Keep open for logs and debugging
# Accessible via: http://localhost:19002
```

### Hot Reload

The app supports Hot Module Replacement (HMR). When you save a file:
- Changes appear automatically without full reload
- App state may reset depending on the change
- Full reload: Press 'r' in the Expo terminal

### Testing Credentials

Use these credentials to test the app:

```
Email: user@example.com
Password: password123
```

After login, you'll have access to:
- Sample quiz packages
- Dashboard with rankings
- Purchase functionality (using mock payment)

## Platform-Specific Setup

### Android Setup (Detailed)

1. **Install Android SDK:**
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install Android API 31+ and build tools

2. **Set Environment Variables:**
   ```bash
   # macOS/Linux
   export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/tools

   # Windows (in PowerShell as Admin)
   setx ANDROID_SDK_ROOT "%LOCALAPPDATA%\Android\sdk"
   ```

3. **Start Android Emulator:**
   - Open Android Studio
   - Click AVD Manager
   - Select an emulator and click Play
   - Wait for it to fully boot

4. **Run the App:**
   ```bash
   npm run android
   ```

### iOS Setup (macOS only)

1. **Install Dependencies:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

2. **Open Xcode (Optional):**
   ```bash
   open ios/missfit.xcworkspace
   ```

3. **Run the App:**
   ```bash
   npm run ios
   ```

### Web Setup

1. **Start Development Server:**
   ```bash
   npm run web
   ```

2. **Access in Browser:**
   - Opens automatically to `http://localhost:3000`
   - Dev tools available: Press F12

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Problem:** `Address already in use`

**Solution:**
```bash
# Find and kill process on port 3001 (API)
lsof -i :3001
kill -9 <PID>

# Or use different port
PORT=3002 npm run mock-api
```

#### 2. Module Not Found

**Problem:** `Cannot find module 'expo'`

**Solution:**
```bash
npm install
# or reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. API Connection Failed

**Problem:** `Network request failed`

**Solution:**
1. Ensure mock API is running: `npm run mock-api`
2. Check API_BASE_URL in `.env` matches server
3. For Android emulator: Use `10.0.2.2:3001` instead of `localhost:3001`
4. For iOS simulator: Ensure network access enabled

#### 4. Android Emulator Issues

**Problem:** Emulator won't start

**Solution:**
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd <emulator_name>

# Or use Android Studio AVD Manager
```

#### 5. iOS Build Fails

**Problem:** CocoaPods error

**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

#### 6. Blank White Screen

**Problem:** App loads but shows white screen

**Solution:**
- Force reload: Press 'r' in Expo terminal
- Hard reload: Press 'R' (capital R)
- Check console logs for errors
- Ensure API is running and accessible

#### 7. TypeScript Errors

**Problem:** Type errors in IDE

**Solution:**
```bash
# Rebuild TypeScript
npx tsc --noEmit

# Or restart the development server
npm start --clear
```

### Debug Mode

Enable detailed logging:

```bash
# In .env
LOG_LEVEL=debug
APP_ENV=development

# Then in Expo terminal
# Press 'j' for debugger options
```

## Development Tools

### Recommended IDE Setup

**Visual Studio Code:**
1. Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - Thunder Client (REST API testing)
   - React Native Tools
   - TypeScript Vue Plugin

2. Create `.vscode/settings.json`:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "prettier.semi": true,
     "prettier.singleQuote": true,
     "prettier.trailingComma": "es5"
   }
   ```

### API Testing

**Using Thunder Client (VS Code):**
1. Install Thunder Client extension
2. Create new request
3. Set method to POST
4. URL: `http://localhost:3001/api/auth/login`
5. Add JSON body
6. Click Send

**Using Postman:**
1. Download [Postman](https://www.postman.com/)
2. Create new collection
3. Import endpoints from API_DOCUMENTATION.md
4. Set environment variable: `{{BASE_URL}}` = `http://localhost:3001/api`

## File Structure Verification

Ensure these directories exist:

```
miss-fit/
├── src/
│   ├── navigation/
│   ├── screens/
│   ├── redux/
│   └── services/
├── mock-api/
├── assets/ (if any)
├── App.tsx
├── app.json
└── package.json
```

## Building for Production

### Android Build

```bash
# Create APK
eas build --platform android

# Or use local build (requires Android SDK)
cd android
./gradlew assembleRelease
```

### iOS Build

```bash
# Create IPA
eas build --platform ios

# Or use Xcode for local build
open ios/missfit.xcworkspace
# Product → Archive
```

### Web Build

```bash
# Create static build
npm run build
# Output in dist/ directory
```

## Deployment

### Expo Go (For Testing)

1. Install [Expo Go](https://expo.dev/client) on your phone
2. Scan QR code from `npm start` output
3. App loads on your device

### EAS (Managed Hosting)

1. Create Expo account at [expo.dev](https://expo.dev)
2. Login: `expo login`
3. Build: `eas build`
4. Submit: `eas submit` (App Store/Play Store)

### Custom Deployment

See detailed production build instructions in each platform's documentation.

## Performance Tips

### Optimize Bundle Size

```bash
# Analyze bundle
npm run analyze

# Remove unused dependencies
npm prune
```

### Enable Production Mode

```bash
# In .env
APP_ENV=production
LOG_LEVEL=error

# Building for production
expo build:android --type apk --release-channel production
```

### Monitor Performance

- Use React DevTools: `expo install react-devtools`
- Check Network: Expo DevTools → Network tab
- Profile: Expo DevTools → Performance tab

## Getting Help

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)

### Community Support
- Stack Overflow: Tag with `react-native` and `expo`
- Expo Forums: [forums.expo.dev](https://forums.expo.dev/)
- GitHub Issues: Report bugs in the project repository

### Local Resources
- API Documentation: See `API_DOCUMENTATION.md`
- Project README: See `README.md`
- This guide: `SETUP_GUIDE.md`

## Next Steps

After setup:

1. **Explore the app:**
   - Login with test credentials
   - Take a quiz
   - Check rankings
   - Try payment flow

2. **Customize for your needs:**
   - Update color scheme in styles
   - Modify quiz questions in mock API
   - Add your own Firebase config

3. **Connect to real backend:**
   - Replace API endpoints in `src/services/api.ts`
   - Update Redux slices if needed
   - Implement actual authentication

4. **Deploy:**
   - Build for your target platform
   - Follow platform-specific deployment steps
   - Monitor and gather user feedback

---

**Happy Coding!** 🚀

For questions or issues, refer to the documentation files or the project README.
