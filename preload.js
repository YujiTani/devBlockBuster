const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
  getAssetPath: (filename) => path.join(__dirname, 'sounds', filename)
});