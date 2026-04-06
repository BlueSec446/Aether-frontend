import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

app.disableHardwareAcceleration(); //For dev in wsl (no access to GPU)

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,

    icon: path.join(__dirname, 'src', 'lib', 'assets', 'icon.png'),

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js') //Injects the context bridge to the backend
    }
  });

  // DEV MODE: Load the URL where Vite is serving Svelte
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    const startUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    mainWindow.loadURL(startUrl);
    mainWindow.webContents.openDevTools(); // Open Console automatically
  }
  // PROD MODE: Load the static HTML file built by Svelte
  else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }
}

app.whenReady().then(() => {
  //Menu.setApplicationMenu(null); // Disable Optionsbar. Disabled for dev to access console
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
