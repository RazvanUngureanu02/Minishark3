const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getPcapData: async () => {
    return await ipcRenderer.invoke('getPcapData');
  }
});