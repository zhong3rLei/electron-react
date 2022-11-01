import { resolve } from "path"

export default {
    send (key:string,...arg:Array<any>) {
        window.electron.ipcRenderer.sendMessage(key, [...arg])
    },
    on (key:string, call:Function) {
        return new Promise(resolve => {
            window.electron.ipcRenderer.on(key, (...arg)=>{
                call(...arg)
                resolve([...arg])
            })
        })
    },
    get (key:string) {
        window.electron.ipcRenderer.sendMessage('data-fetch', ['get' + key])
        return new Promise (resolve => {
            window.electron.ipcRenderer.once('get' + key, (data:any) => {
                resolve(JSON.parse(data))
            })
        })
    },
    set (key:string,data:any) {
        window.electron.ipcRenderer.sendMessage('data-fetch', ['set' + key,JSON.stringify(data)])
        return new Promise (resolve => {
            window.electron.ipcRenderer.once('set' + key, (data:any) => {
                resolve(data)
            })
        })
    }
}