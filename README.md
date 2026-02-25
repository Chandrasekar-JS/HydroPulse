# 💧 HydroPulse - Water Tracking App

A cross-platform React Native (Expo) app to track daily water intake, build hydration streaks, and get smart reminders.

## Features

### 1. User Profile
- Onboarding wizard captures name, weight (kg/lbs), and activity level
- Auto-calculates personalized recommended daily water intake
- Editable anytime from Settings

### 2. Daily Streak
- Tracks consecutive days of meeting your hydration goal
- Current streak counter with 🔥 indicator
- Best streak record (all-time high)
- Weekly dot view showing last 7 days at a glance

### 3. Customizable Water Goal
- Set any daily goal in milliliters (with smart recommendation)
- Recommendation formula: `weight(kg) × 35ml × activity_multiplier`
- Adjustable cup sizes: 100ml, 150ml, 200ml, 250ml, 300ml, 500ml
- Quick-add buttons for half cup, full cup, and double cup

### 4. Smart Notifications
- Configurable reminder frequency: 15 min, 20 min (default), 30 min, 45 min, 1hr, 1.5hr, 2hr
- Set active hours window (e.g., 7:00 AM to 10:00 PM)
- Rotating motivational messages
- Native push notifications on both iOS and Android
- Automatically pauses outside active hours

## Tech Stack

- **Framework**: React Native with Expo SDK 52
- **Navigation**: React Navigation (Bottom Tabs)
- **Storage**: AsyncStorage (persistent local storage)
- **Notifications**: expo-notifications (native push on both platforms)
- **Graphics**: react-native-svg (animated water circle)
- **Animations**: react-native-reanimated

## Project Structure

```
HydroPulse/
├── App.js                          # Main entry: state management, navigation, orchestration
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration
└── src/
    ├── constants/
    │   ├── theme.js                # Colors, spacing, typography, shadows
    │   └── defaults.js             # Default values, storage keys, options
    ├── utils/
    │   ├── helpers.js              # Pure utility functions
    │   ├── storage.js              # AsyncStorage CRUD wrapper
    │   └── notifications.js        # Notification scheduling & permissions
    ├── components/
    │   ├── WaveCircle.js           # Animated SVG water fill circle
    │   └── UIComponents.js         # Reusable buttons, inputs, cards
    └── screens/
        ├── ProfileSetupScreen.js   # 3-step onboarding wizard
        ├── HomeScreen.js           # Main dashboard with tracking
        ├── StatsScreen.js          # Statistics and progress
        └── SettingsScreen.js       # Profile & settings management
```

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Expo CLI: `npm install -g expo-cli` (optional, npx works too)
- Expo Go app on your phone (for testing on device)

### Installation

```bash
# Navigate to project directory
cd HydroPulse

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. **iOS**: Scan QR code with Camera app → opens in Expo Go
2. **Android**: Scan QR code with Expo Go app
3. **Emulator**: Press `i` for iOS Simulator or `a` for Android Emulator

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for Android (APK)
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios --profile preview

# Build both
eas build --platform all
```

### EAS Build Configuration

Create `eas.json` in the project root for build profiles:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## App Screens

| Screen | Description |
|--------|-------------|
| **Onboarding** | 3-step setup: Welcome → Profile → Settings |
| **Home** | Water circle, quick-add, streak banner, daily log |
| **Stats** | Consumption stats, streak records, hourly breakdown, progress bar |
| **Settings** | View/edit profile, change goals, notification config, reset data |

## Data Persistence

All data is stored locally on-device using AsyncStorage:
- `@hydro_profile` - User profile
- `@hydro_settings` - App settings
- `@hydro_streak` - Streak history
- `@hydro_intake_YYYY-MM-DD` - Daily intake logs

No server or internet connection required.

## License

MIT
