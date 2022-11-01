export class Emiter {
    private store = new Map()
    emit (name:string, ...args:any) {
        if (this.store.get(name)) {
            this.store.get(name).callbacks.forEach((fn:Function) => {
                fn(...args)
            })
        }
    }
    on (name:string, call: Function) {
        if (this.store.get(name)) {
            this.store.get(name).callbacks.push(call)
        } else {
            this.store.set(name,[call])
        }
    }
}