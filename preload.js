const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
  // getPcapData: async (filePath) => {
  //   return await ipcRenderer.invoke('getPcapData', filePath);
  // },
  receiveMessageFromMain: (callback) => {
    ipcRenderer.on('message-from-main', (_, message, index) => {
      callback(message, index);
    });
  },
  startWorker: (index, indexInterface) => {
    ipcRenderer.send('startWorker', index, indexInterface);
  },
  stopWorker: (index) => {
    ipcRenderer.send('stopWorker', index);
  },
  startFunction: () => {
    ipcRenderer.send('startCapture');
  },
  stopFunction: () => {
    ipcRenderer.send('stopCapture');
  },
  restartFunction: () => {
    ipcRenderer.send('restartCapture');
  },
  saveFunction: () => {
    ipcRenderer.send('save');
  },
  movePacketsFunction: () => {
    ipcRenderer.send('movePackets');
  },
  deletePacketsFunction: () => {
    ipcRenderer.send('deletePackets');
  },
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  },

  showSaveDialog: async (options) => {
    const result = await ipcRenderer.invoke('showSaveDialog', options);
    return result;
  },

  getInterfaceNames: async () => {
    return await ipcRenderer.invoke('getInterfaceNames');
  },
  Operations: async (filePath) => {
    return await ipcRenderer.invoke('Operations', filePath);
  },
  OperationsLiveCapture: async (networkInterfaceIndex) => {
    return await ipcRenderer.invoke('OperationsLiveCapture', networkInterfaceIndex);
  },
  SavePCAP: async (data, filePath) => {
    return await ipcRenderer.invoke('SavePCAP', data, filePath);
  },
  StopLiveCapture: async (tabIndex) => {
    return await ipcRenderer.invoke('StopLiveCapture', tabIndex);
  },
  StartLiveCapture: async (tabIndex) => {
    return await ipcRenderer.invoke('StartLiveCapture', tabIndex);
  }
});