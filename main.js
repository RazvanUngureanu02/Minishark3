const { app, BrowserWindow, Menu, ipcMain, dialog} = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const getPcapData = require("./NAPI/build/Release/operations");
const { Worker } = require('worker_threads');

const workers = {}; // Store active worker instances

function createWindow(){
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 850,
        minHeight: 850,
        maxWidth: 1920,
        maxHeight: 1080,
        icon: __dirname + '/minishark_icon.jpg',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
          }
    });

    win.loadFile('src/HTML/index.html');

    function createMenu() {
      const template = [
        {
          label: 'File',
          submenu: [
            {
              label: 'Save',
              accelerator: 'CmdOrCtrl+S',
              click: () => {
                // Handle the "Save" button click event
                win.webContents.send('save');
              },
            },
            { role: 'quit' }, // Add the default "Quit" menu item
          ],
        },
        { role: 'editMenu' }, // Add the default "Edit" menu items
        { role: 'viewMenu' }, // Add the default "View" menu items
        {
          label: 'Capture',
          submenu: [
            {
              label: 'Start',
              click: () => {
                // Handle "Start" button click event
                win.webContents.send('startCapture');
              },
            },
            {
              label: 'Stop',
              click: () => {
                // Handle "Stop" button click event
                win.webContents.send('stopCapture');
              },
            },
          ],
        },
        {
          label: 'Packets',
          submenu: [
            {
              label: 'Move packets',
              click: () => {
                win.webContents.send('movePackets');
              },
            },
            {
              label: 'Delete packets',
              click: () => {
                win.webContents.send('deletePackets');
              },
            },
          ],
        },
      ];
    
      const menu = Menu.buildFromTemplate(template);
      Menu.setApplicationMenu(menu);
    
      win.webContents.on('did-finish-load', () => {
        //win.webContents.send('window-loaded'); // Notify the window that it has finished loading
        //win.webContents.send('message-from-main', 'Hello from main process!');
      });
    }

    createMenu();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('showSaveDialog', async (event, options) => {
      const result = await dialog.showSaveDialog(options);
      return result;
    });

    ipcMain.handle('getInterfaceNames', async (event) => {
        return getPcapData.getInterfaceNames();
    });

    ipcMain.handle('Operations', async (event, filePath) => {
        return getPcapData.Operations(filePath);
    });

    ipcMain.handle('OperationsLiveCapture', async (event, networkInterfaceIndex, tabIndex) => {
        return getPcapData.OperationsLiveCapture(networkInterfaceIndex);
    });

    ipcMain.handle('SavePCAP', async (event, data, filePath) => {
      return getPcapData.SavePCAP(data, filePath);
    });

    ipcMain.handle('StopLiveCapture', async (event, tabIndex) => {
      return getPcapData.StopLiveCapture(tabIndex);
    });

    ipcMain.handle('StartLiveCapture', async (event, tabIndex) => {
      return getPcapData.StartLiveCapture(tabIndex);
    });

    // worker threads

    ipcMain.on('startWorker', async (event, index, indexInterface) => {
      if (workers[index]) {
        console.log(`Worker ${index} is already running.`);
        return;
      }
      
      // Start the worker process
      const worker = new Worker(path.join(__dirname, 'worker.js'), { workerData: { index, indexInterface } });
      workers[index] = worker;
    
      // Listen for messages from the worker process
      worker.on('message', (result) => {
        // Handle the message received from the worker process
        //console.log(`Worker ${index}: ${result}`);
        //console.log(`Worker ${JSON.stringify(result)}`);

        const windows = BrowserWindow.getAllWindows();
        windows.forEach((window) => {
          window.webContents.send('message-from-main', result, index);
        });
      });
    
      // Handle errors from the worker process
      worker.on('error', (error) => {
        console.error(`Worker ${index} error:`, error);
      });
    
      // Handle the worker process completion
      worker.on('exit', (code) => {
        console.log(`Worker ${index} exited with code ${code}`);
        delete workers[index]; // Remove the worker from the active workers list
      });
    
      // Wait for the worker to start
      await new Promise((resolve) => {
        worker.once('online', resolve);
      });
    });
    ipcMain.on('stopWorker', (event, index) => {
      const worker = workers[index];
      if (!worker) {
        console.log(`Worker ${index} is not running.`);
        return;
      }
  
      // Terminate the worker process
      worker.terminate();
      delete workers[index]; // Remove the worker from the active workers list
    });
 });
  
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit();
})
