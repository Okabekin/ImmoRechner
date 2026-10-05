const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1360, height: 900, minWidth: 420, minHeight: 500,
    title: 'Immobilien-Rechner', backgroundColor: '#f3f5f6', autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: 'deny' }; });
  return win;
}

// Automatische Updates über GitHub Releases (nur installierte Windows-Version)
function updatesPruefen(win) {
  if (!app.isPackaged || process.platform !== 'win32' || process.env.PORTABLE_EXECUTABLE_DIR) return;
  const { autoUpdater } = require('electron-updater');
  autoUpdater.on('update-downloaded', async (info) => {
    const { response } = await dialog.showMessageBox(win, {
      type: 'info', buttons: ['Jetzt neu starten', 'Später'], defaultId: 0, cancelId: 1,
      title: 'Update bereit', message: `Version ${info.version} ist heruntergeladen.`,
      detail: 'Das Programm startet neu und ist danach auf dem neuesten Stand. Bei „Später“ wird das Update beim nächsten Schließen installiert.'
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', () => {}); // offline oder GitHub nicht erreichbar: still weiterarbeiten
  autoUpdater.checkForUpdates().catch(() => {});
}

Menu.setApplicationMenu(null);
app.whenReady().then(() => updatesPruefen(createWindow()));
app.on('window-all-closed', () => app.quit());
