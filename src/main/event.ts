import {
  app,
  BrowserWindow,
  shell,
  ipcMain
} from 'electron';
import createWindow from './frame'
import fs from 'fs'
import path from 'path'

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(async () => {
    mainWindow = await createWindow('', {
        width: 500,
        height: 80,
        y: 0,
        x: 800,
        // minimizable: false
    });
    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) mainWindow = await createWindow();
    });
}).catch(console.log);


/**
 * Add event listeners...
 */
let winMap = new Map()
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const routes = ['/dailytask','/weeklytask', '/monthlytask','/peroidicaltask', '/bag']
ipcMain.on('new-window', async (event, [path]) => {
    if (routes.includes(path)) {
        if (!winMap.get(path)) {
            let win = createWindow('?route=' + path, {
                width: 580,
                height: 508
            })
            winMap.set(path, await win)
        } else {
            winMap.get(path).show()
        }
    }
  
});

ipcMain.on('close-window', async (event, [path]) => {
    if (routes.includes(path)) {
        if (winMap.get(path)) {
            winMap.get(path).hide()
        }
    }
  
});


ipcMain.on('change-data', async (event) => {
    mainWindow?.webContents.send('change-data')
})

ipcMain.on('change-capability', event => {
    mainWindow?.webContents.send('change-capability')
    winMap.get('/peroidicaltask')?.webContents.send('change-capability')
})
ipcMain.on('change-activity', event => {
    winMap.get('/weeklytask')?.webContents.send('change-activity')
})
ipcMain.on('daily-sign', event => {
    winMap.get('/monthlytask')?.webContents.send('daily-sign')
})
ipcMain.on('change-peroidical', event => {
    winMap.get('/peroidicaltask')?.webContents.send('change-peroidical')
})
ipcMain.on('change-prizepool', event => {
    winMap.get('/bag')?.webContents.send('change-prizepool')
})

ipcMain.on('data-fetch',(event, [route, data]) => {
    
    let dataPath = path.resolve(app.getAppPath(), './data-base')
    fs.readdir(dataPath, (err, files) => {
        if(err) {
            fs.mkdirSync(dataPath)
        } else {
            switch (route) {
                case 'getDailyTask':
                    handlerGET(dataPath, 'dailytask', route, event)
                    break;
                case 'setDailyTask':
                    if (data) {
                        handlerSET(dataPath, 'dailytask', data, route, event)
                    }
                    break;
                case 'getWeeklyTask':
                    handlerGET(dataPath, 'weeklytask', route, event)
                    break;
                case 'setWeeklyTask':
                    if (data) {
                        handlerSET(dataPath, 'weeklytask', data, route, event)
                    }
                    break;
                case 'getMonthlyTask':
                    handlerGET(dataPath, 'monthlytask', route, event)
                    break;
                case 'setMonthlyTask':
                    if (data) {
                        handlerSET(dataPath, 'monthlytask', data, route, event)
                    }
                    break;
                case 'getPeroidicalTask':
                    handlerGET(dataPath, 'peroidicaltask', route, event)
                    break;
                case 'setPeroidicalTask':
                    if (data) {
                        handlerSET(dataPath, 'peroidicaltask', data, route, event)
                    }
                    break;
                case 'getPrizePool':
                    handlerGET(dataPath, 'prizepool', route, event)
                    break;
                case 'setPrizePool':
                    if (data) {
                        handlerSET(dataPath, 'prizepool', data, route, event)
                    }
                    break;
                case 'getCapability':
                    handlerGET(dataPath, 'capability', route, event)
                    break;
                case 'setCapability':
                    if (data) {
                        handlerSET(dataPath, 'capability', data, route, event)
                    }
                    break;
            }
        }
    })
})
function handlerGET (dataPath:string,filname:string, route:string, event:any) {
    fs.readFile(dataPath + '/'+filname+'.json', 'utf-8', (err,data) => {
        if (err) {
            fs.writeFileSync(dataPath + '/'+filname+'.json','null')
            event.sender.send(route, 'null')
        } else {
            let str = fs.readFileSync(dataPath + '/'+filname+'.json', 'utf-8')
            event.sender.send(route, str)
        }
    })
}
function handlerSET (dataPath:string,filname:string,data:any,route:string,event:any) {
    fs.writeFile(dataPath + '/'+filname+'.json',data, (err)=>{
        if (!err) {
            event.sender.send(route, {status: true})
        } else {
            event.sender.send(route, {err: err})
        }
    })
}