const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let mainWindow;
let serverProcess;
const port = process.env.PORT || '3000';
const host = process.env.HOST || '127.0.0.1';
const baseUrl = `http://${host}:${port}`;

function getServerEntryPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app', 'webui-build', 'index.js');
  }
  return path.resolve(__dirname, '..', 'webui', 'build', 'index.js');
}

function getServerCwd() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'app', 'webui-build');
  }
  return path.resolve(__dirname, '..', 'webui');
}

function startServer() {
  const serverEntry = getServerEntryPath();
  const cwd = getServerCwd();

  if (!fs.existsSync(serverEntry)) {
    console.warn('Built web server not found. Run the desktop build script first.');
    return;
  }

  serverProcess = spawn(process.execPath, [serverEntry], {
    cwd,
    env: { ...process.env, PORT: port, HOST: host },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', (data) => {
    process.stdout.write(`[server] ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    process.stderr.write(`[server] ${data}`);
  });

  serverProcess.on('exit', (code) => {
    console.log(`Server exited with code ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    title: 'Starmap',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.setMenuBarVisibility(false);

  setTimeout(() => {
    mainWindow.loadURL(baseUrl);
  }, 2000);
}

app.whenReady().then(() => {
  startServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
