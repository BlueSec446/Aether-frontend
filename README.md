# Aether-Frontend

This Repository handles all the frontend logic for [**Aether**](<(https://github.com/SevuCK/aether)>), the Tor Chat App.

# Project Setup & Overview

This project is a desktop chat application built using a **Web-Hybrid Architecture**.

## Local Development Setup

Follow these steps to set up a fresh environment.

### 1. System Prerequisites

- **Node.js (v20+):** [Download Here](https://nodejs.org/)

### 2. Installation

Clone the repository and install the Node dependencies:

```bash
git clone https://github.com/BlueSec446/Aether-frontend
cd Aether-frontend
npm install
```

### 3. Running the App

Start the development environment. This will launch the Vite local server and open the Electron desktop window.

```bash
npm run dev
```

- **Hot Reloading:** Saving any file in `src/` will instantly update the running app window.

### 4. Testing the App

Test the functionallity during developement. This will call `vitest` and execute every _.test._ file.

```bash
npm run test
```

### 5. Linting & Formatting

To check linting `eslint` and `prettier` are used.

Lint:

```bash
npm run lint
```

Auto-formatting:

```bash
npm run format
```

## Build

**Only build the whole project via the [root of aether](https://github.com/SevuCK/aether)**

## Architecture Overview

We use a "Two-Headed" structure where the UI and the System logic run in separate processes:

- **Frontend (The Renderer):** Built with **SvelteKit** + **Vite**.
  - _Location:_ `src/`
  - _Role:_ Handles all UI, Chat Logic, and State Management.
- **Backend (The Main Process):** Built with **Electron** (Node.js).
  - _Location:_ `main.js` (Root)
  - _Role:_ Creates the OS window, handles system menus, and manages the application lifecycle.

**Tools Used:**

- **Concurrent.ly:** Runs the Vite server and Electron process simultaneously.
- **Wait-on:** Ensures Electron doesn't launch until Vite is ready.
- **Cross-env:** Sets environment variables (like `NODE_ENV`) across Windows/Linux/Mac.

### Folder Structure

This project uses a hybrid architecture, combining a **SvelteKit Single Page Application (SPA)** for the reactive UI with an **Electron** wrapper for desktop deployment and secure communication with the local Python/Flask backend.

```text
aether-frontend/
├── .github/                  # Automation for CI/CD-Pipeline
├── electron/                 # Electron shell and system-level configurations
│   ├── main.js               # Main process: Window management and app lifecycle
│   └── preload.js            # Secure Context Bridge: Exposes `frontendAPI` to the UI
│
├── src/                      # SvelteKit frontend source code
│   ├── lib/                  # Shared internal modules (accessible via `$lib`)
│   │   ├── assets/           # Static local files (e.g., Send_Icon.png, icon.ico)
│   │   ├── components/       # Reusable UI components (ChatWindow, ChatBar, etc)
│   │   ├── interfaces/       # TypeScript definitions (e.g., Message, Chat objects)
│   │   ├── stores/           # Svelte reactive stores (chat_store, messages_store)
│   │   └── controllers/      # API logic and state handlers (chat_window.ts, register.ts)
│   │
│   ├── routes/               # SvelteKit routing structure (e.g., +page.svelte)
│   ├── app.d.ts              # Defines interfaces for global Context
│   ├── app.html              # Main HTML template
│   └── global.css            # Global styling
│
├── .gitignore
├── .npmrc                    # Enforces Node.js version during npm install
├── *config.js(on)            # Config files of the modules used
└── package.json
```
