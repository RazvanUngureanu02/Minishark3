const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const getPcapData = require("./NAPI/build/Release/operations");

function createWindow(){
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 500,
        minHeight: 500,
        maxWidth: 1920,
        maxHeight: 1080,
        icon: __dirname + '/marinel.ico',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
          }
    });

    win.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('getPcapData', async (event) => {
        return getPcapData();
      });
 });
  
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
})
