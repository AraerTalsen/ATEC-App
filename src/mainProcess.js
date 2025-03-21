const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let exam;
let isOpen = false;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => 
{
  //Create the browser window.
  const mainWindow = new BrowserWindow(
  {
    width: 900,
    height: 810,
    webPreferences: 
    {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'chooseExam.html'));

  mainWindow.on('close', ()=>
  {
    try
    {
      vidWindow.close();
    }
    catch(err) { console.log(err); }
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  const vidWindow = new BrowserWindow({
    width: 800,
    height: 510,
    webPreferences: 
    {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    show: false
  })
  vidWindow.loadFile(path.join(__dirname, 'videoWindow.html'));
  
  ipcMain.on('toggleVidWindow', ()=>
  {
    !isOpen ? vidWindow.show() : vidWindow.hide();

    isOpen = !isOpen;
  });


  ipcMain.on('load', (event, arg)=>
  {
    vidWindow.webContents.send('load', arg);
  });

  ipcMain.on('start', ()=>
  {
    vidWindow.webContents.send('start');
  });

  ipcMain.on('stop', ()=>
  {
    vidWindow.webContents.send('stop');
  });

  ipcMain.on('chosenExam', (event, arg)=>
  {
    exam = arg;
  });

  ipcMain.on('recallExam', (event)=>
  {
    event.returnValue = exam;
  });

  ipcMain.on('vidEnded', ()=>
  {
    mainWindow.webContents.send('vidEnded');
  });
};
  
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
