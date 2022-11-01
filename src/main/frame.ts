import {
    app,
    BrowserWindow,
  } from 'electron';
import path from 'path';
import {
  resolveHtmlPath
} from './util';
export default async (route:string='',params:Record<string,any> = {}) => {

    const RESOURCES_PATH = app.isPackaged ?
      path.join(process.resourcesPath, 'assets') :
      path.join(__dirname, '../../assets');
  
    const getAssetPath = (...paths: string[]): string => {
      return path.join(RESOURCES_PATH, ...paths);
    };
    let newWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      icon: getAssetPath('icon.png'),
      webPreferences: {
           // 关闭上下文隔离
           contextIsolation: true,
           zoomFactor: 1.0,
           // Use pluginOptions.nodeIntegration, leave this alone
           // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
           nodeIntegration: true,
        preload: app.isPackaged ?
          path.join(__dirname, 'preload.js') :
          path.join(__dirname, '../../.erb/dll/preload.js'),
      },
      transparent: true,
      frame: false,
      backgroundColor: 'rgba(0,0,0,0.1)',
      minimizable: true,
      ...params
    });
  
    newWindow.loadURL(resolveHtmlPath('index.html' + route));
  
    newWindow.on('ready-to-show', () => {
        newWindow.show();
    });
    return newWindow
}