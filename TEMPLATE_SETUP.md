# Template Setup Guide

Complete checklist for setting up your new project from this template.

## 1. Initial Configuration

### App Identity

Update `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "scheme": "yourapp",
    "ios": {
      "bundleIdentifier": "com.yourcompany.yourapp"
    },
    "android": {
      "package": "com.yourcompany.yourapp"
    },
    "owner": "your-expo-username"
  }
}
```

Update `package.json`:
```json
{
  "name": "your-app-name"
}
```

### Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_SERVER_URL=https://your-api.com
```

## 2. EAS Setup

### Initialize EAS

```bash
eas login
eas init
```

This will:
- Create a new EAS project
- Update `app.json` with your project ID

### Update eas.json

Replace placeholder URLs in `eas.json`:
```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_SERVER_URL": "https://dev-api.yourcompany.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SERVER_URL": "https://api.yourcompany.com"
      }
    }
  }
}
```

## 3. Firebase Setup (Optional)

### Android

1. Create Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Add Android app with your package name
3. Download `google-services.json`
4. Place in project root

### iOS

1. Add iOS app in Firebase Console
2. Download `GoogleService-Info.plist`
3. Add to iOS project via Xcode

## 4. Sentry Setup (Optional)

1. Create project at [Sentry](https://sentry.io)
2. Add plugin to `app.json`:
```json
{
  "plugins": [
    [
      "@sentry/react-native/expo",
      {
        "url": "https://sentry.io/",
        "project": "your-project",
        "organization": "your-org"
      }
    ]
  ]
}
```
3. Add auth token to `eas.json` for builds:
```json
{
  "build": {
    "production": {
      "env": {
        "SENTRY_AUTH_TOKEN": "your-token"
      }
    }
  }
}
```

## 5. Push Notifications

### Expo Push Notifications

Already configured. Just ensure your EAS project is set up.

### FCM (Android)

Requires `google-services.json` from Firebase.

### APNs (iOS)

Configure in EAS credentials:
```bash
eas credentials
```

## 6. App Icons & Splash

Replace these files with your assets:
- `src/shared/assets/images/iosappIcon.png` - iOS app icon
- `src/shared/assets/images/androidIcon.png` - Android adaptive icon
- `src/shared/assets/images/splashbackground.png` - Splash screen

## 7. Clean Up

Remove template-specific files if not needed:
- `TEMPLATE_SETUP.md` - This file
- Update `CLAUDE.md` and `AGENTS.md` for your project

## 8. First Build

### Development build (recommended first)

```bash
# iOS Simulator
eas build --profile development --platform ios

# Android APK
eas build --profile development --platform android
```

### Install and test

```bash
bun start
# Press 'i' for iOS or 'a' for Android
```

## Checklist

- [ ] Updated `app.json` (name, slug, bundleIdentifier, package)
- [ ] Updated `package.json` name
- [ ] Created `.env` from `.env.example`
- [ ] Initialized EAS project (`eas init`)
- [ ] Updated `eas.json` URLs
- [ ] Added Firebase config (if using)
- [ ] Added Sentry config (if using)
- [ ] Replaced app icons and splash screen
- [ ] Tested development build
- [ ] Removed this setup file

## Troubleshooting

### Metro cache issues
```bash
bun start --clear
```

### Dependency issues
```bash
rm -rf node_modules
bun install
bun postinstall
```

### TypeScript errors
```bash
bun typecheck
```

### Build issues
Check EAS build logs at [expo.dev](https://expo.dev)
