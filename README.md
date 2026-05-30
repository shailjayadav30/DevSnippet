# Codezy

A modern, developer-focused code snippet manager built with **Expo**, **React Native**, and **TypeScript**. Save, organise, browse, and understand your code — completely offline.

## Download APK

Try the latest Android build of **Codezy** without setting up the development environment.

### Direct Download

👉 **[Download Latest APK](https://expo.dev/accounts/shailjayadav/projects/Codezy/builds/367a5f31-1ba2-4128-bd3b-2ea7888ccf1c)**

### Installation

1. Download the APK file.
2. Open the downloaded file on your Android device.
3. If prompted, enable  **Install from Unknown Sources** .
4. Complete the installation and launch Codezy.

> Note: APK builds are intended for Android devices only.

## Features

### Snippet Management

- Create, edit, and delete code snippets
- Attach a title, programming language, and tags to every snippet
- Browse snippets filtered by language using the horizontal language scroll bar
- Full-text search across title, language, tags, and code body
- Bookmark favourite snippets for quick access

### Offline-First Storage

All snippet data is stored locally in an SQLite database using `expo-sqlite`. The app works fully without an internet connection — create, edit, search, and view bookmarked snippets offline.

### AI Code Explanation

Select any snippet (or paste code directly) and use the **AI** tab to generate:

- Detailed code explanations
- Concise summaries
- Improvement suggestions

Powered by **Google Gemini**. Choose from six models:

| Model                     | Tier               | Best For                      |
| ------------------------- | ------------------ | ----------------------------- |
| Gemini 2.5 Flash          | Free               | Default — latest and fastest |
| Gemini 2.0 Flash          | Free               | Stable and reliable           |
| Gemini 2.0 Flash Thinking | Free               | Step-by-step reasoning        |
| Gemini 1.5 Flash          | Free               | Proven everyday tasks         |
| Gemini 1.5 Flash 8B       | Free               | Lightest, ultra-fast          |
| Gemini 1.5 Pro            | Free (limited RPM) | Deepest analysis              |

### Export & Sharing

Export any snippet directly from the details screen in three formats:

- `.txt` — plain text
- `.js` — JavaScript source file
- `.json` — full snippet metadata + code

Share to any app via the native share sheet.

### File Manager

Browse and manage files stored in the app's local document directory using `expo-file-system`:

- Navigate into sub-folders
- Create new folders
- Share files via the native share sheet
- Delete files and folders
- Exported snippets appear here automatically

### Settings

- Save your **Gemini API key** securely using the device Keychain / Keystore (`expo-secure-store`)
- View which storage technology is used for each feature
- App version and feature overview

---

## Tech Stack

| Technology                                    | Purpose                                         |
| --------------------------------------------- | ----------------------------------------------- |
| Expo SDK 56                                   | Build toolchain and native module management    |
| React Native 0.85                             | Cross-platform UI framework                     |
| TypeScript                                    | Static typing                                   |
| Expo Router                                   | File-based navigation                           |
| `expo-sqlite`                               | Local snippet database (offline-first)          |
| `@react-native-async-storage/async-storage` | App preferences storage                         |
| `expo-secure-store`                         | Encrypted API key storage (Keychain / Keystore) |
| `expo-file-system`                          | Local file management                           |
| `expo-sharing`                              | Native share sheet integration                  |
| `expo-clipboard`                            | Copy snippet code to clipboard                  |
| `react-native-markdown-display`             | Render AI responses as formatted Markdown       |
| Google Gemini API                             | AI code analysis                                |

---

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx               # Root layout — font loading, DB init
│   ├── index.tsx                 # Entry redirect → /(tabs)/home
│   └── (tabs)/
│       ├── _layout.tsx           # Tab bar configuration
│       ├── home/
│       │   ├── _layout.tsx       # Home stack navigator
│       │   ├── index.tsx         # Home screen — snippet list + search
│       │   ├── createSnippet.tsx # Create snippet screen
│       │   ├── snippets/[id].tsx # Snippet detail — view, copy, export, AI
│       │   └── edit/[id].tsx     # Edit snippet screen
│       ├── saved.tsx             # Bookmarked snippets
│       ├── ai.tsx                # AI code analysis screen
│       ├── files.tsx             # Local file manager
│       └── settings.tsx          # API key + app settings
├── components/
│   ├── layout/Screen.tsx         # SafeAreaView wrapper
│   ├── ui/Typography.tsx         # Typed text component
│   ├── MainHeader.tsx            # Home screen header
│   ├── HeaderCreateSnipet.tsx    # Create screen header
│   ├── LangScrollbar.tsx         # Horizontal language filter
│   └── AIExplanation.tsx         # Inline AI explain button + result
├── database/
│   ├── database.ts               # SQLite connection
│   ├── schema.ts                 # Table creation + migration
│   ├── snippetService.ts         # CRUD, search, bookmark operations
│   └── types.ts                  # Snippet TypeScript type
├── services/
│   ├── apiServices.ts            # Gemini API integration
│   └── storageService.ts         # AsyncStorage + SecureStore helpers
└── theme/
    └── theme.ts                  # Colours, fonts, spacing, radius tokens
```

---

## Storage Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Codezy Storage                   │
├──────────────────┬──────────────────────────────────┤
│   SQLite         │  Snippet database                │
│                  │  title, code, language, tags,    │
│                  │  is_bookmarked, created_at        │
├──────────────────┼──────────────────────────────────┤
│  AsyncStorage    │  App preferences                 │
│                  │  theme, font size                │
├──────────────────┼──────────────────────────────────┤
│  SecureStore     │  Sensitive tokens                │
│                  │  Gemini API key                  │
├──────────────────┼──────────────────────────────────┤
│  FileSystem      │  Local files                     │
│                  │  Exported snippets, templates    │
└──────────────────┴──────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Android Studio (emulator) or a physical device with **Expo Go**

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd devSnipet

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then open .env and add your Gemini API key
```

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

> **Get a free key** at [aistudio.google.com](https://aistudio.google.com).
> All six Gemini models used by Codezy are on the free tier.
>
> You can also skip the `.env` file entirely and enter the key inside the app via
> **Settings → Gemini API Key**. It is stored securely using the device Keychain / Keystore.

### Running the App

```bash
# Start Metro bundler with cleared cache
npx expo start -c

# Run on a connected Android device or emulator
npx expo run:android

# Run on iOS simulator (macOS only)
npx expo run:ios
```

---

## Building for Distribution

This project uses [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Log in to your Expo account
eas login

# Preview build — generates an APK you can install directly on a device
eas build --platform android --profile preview

# Production build — generates an AAB for the Play Store
eas build --platform android --profile production
```

### First-Time EAS Setup

```bash
# Link the project to your Expo account (run once)
eas init
```

---

## Screens

| Screen          | Route                          | Description                                     |
| --------------- | ------------------------------ | ----------------------------------------------- |
| Home            | `/(tabs)/home`               | Snippet list, search bar, language filter       |
| Create Snippet  | `/(tabs)/home/createSnippet` | Title, language, tags, code editor              |
| Snippet Details | `/(tabs)/home/snippets/[id]` | View, copy, export, share, bookmark, AI explain |
| Edit Snippet    | `/(tabs)/home/edit/[id]`     | Edit any field of an existing snippet           |
| Saved           | `/(tabs)/saved`              | All bookmarked snippets                         |
| AI Analysis     | `/(tabs)/ai`                 | Paste code, pick model & mode, get AI analysis  |
| Files           | `/(tabs)/files`              | Browse local document directory                 |
| Settings        | `/(tabs)/settings`           | API key management, storage info, about         |

---

## Database Schema

```sql
CREATE TABLE snippets (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  title         TEXT    NOT NULL,
  file_name     TEXT    NOT NULL,
  language      TEXT    NOT NULL,
  code          TEXT    NOT NULL,
  tags          TEXT,                        -- JSON array  e.g. ["REACT","UI"]
  is_bookmarked INTEGER DEFAULT 0,
  created_at    TEXT    DEFAULT CURRENT_TIMESTAMP
);
```

---

## Export Formats

| Format    | Contents                                               |
| --------- | ------------------------------------------------------ |
| `.txt`  | Raw code only                                          |
| `.js`   | Raw code only (as a JavaScript source file)            |
| `.json` | Full snippet — title, file name, language, tags, code |

---

## Supported Languages

TypeScript · JavaScript · Python · Go · Rust · Java · CSS · HTML · SQL · Swift · Kotlin · C++

---

## Acknowledgements

- [Expo](https://expo.dev) — build infrastructure and native module ecosystem
- [Google AI Studio](https://aistudio.google.com) — Gemini API
- [React Native Markdown Display](https://github.com/iamacup/react-native-markdown-display) — AI response rendering
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — monospace font used throughout the UI
