const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');

    // ウィンドウが完全に読み込まれた後にコマンドライン引数を処理
    mainWindow.webContents.on('did-finish-load', () => {
        processCommandLineArguments();
    });
}

function processCommandLineArguments() {
    const args = process.argv.slice(2);
    if (args.length > 0) {
        const duration = parseInt(args[0]);
        if (!isNaN(duration)) {
            mainWindow.webContents.send('start-timer', duration);
        }
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// 二度目の起動時にコマンドライン引数を処理
app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
        processCommandLineArguments();
    }
});