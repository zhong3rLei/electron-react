import channel from '../utils/channel'
type stringKey = Record<string,any>

const requests:stringKey = {
    getDailyTask (param?:any) {
        return new Promise(resolve => {
            channel.get('DailyTask').then(data => {
                resolve(data)
            })
        })
    },
    setDailyTask (data:Object) {
        return new Promise(resolve => {
            channel.set('DailyTask',data).then(data => {
                resolve(data)
            })
        })
    },
    getWeeklyTask (param?:any) {
        return new Promise(resolve => {
            channel.get('WeeklyTask').then(data => {
                resolve(data)
            })
        })
    },
    setWeeklyTask (data:Object) {
        return new Promise(resolve => {
            channel.set('WeeklyTask',data).then(data => {
                resolve(data)
            })
        })
    },
    getMonthlyTask (param?:any) {
        return new Promise(resolve => {
            channel.get('MonthlyTask').then(data => {
                resolve(data)
            })
        })
    },
    setMonthlyTask (data:Object) {
        return new Promise(resolve => {
            channel.set('MonthlyTask',data).then(data => {
                resolve(data)
            })
        })
    },
    getPeroidicalTask (param?:any) {
        return new Promise(resolve => {
            channel.get('PeroidicalTask').then(data => {
                resolve(data)
            })
        })
    },
    setPeroidicalTask (data:Object) {
        return new Promise(resolve => {
            channel.set('PeroidicalTask',data).then(data => {
                resolve(data)
            })
        })
    },
    getPrizePool (param?:any) {
        return new Promise(resolve => {
            channel.get('PrizePool').then(data => {
                resolve(data)
            })
        })
        
    },
    setPrizePool (data:Object) {
        return new Promise(resolve => {
            channel.set('PrizePool',data).then(data => {
                resolve(data)
            })
        })
    },
    getCapability (param?:any) {
        return new Promise(resolve => {
            channel.get('Capability').then(data => {
                resolve(data)
            })
        })
    },
    setCapability (data:Object) {
        return new Promise(resolve => {
            channel.set('Capability',data).then(data => {
                resolve(data)
            })
        })
    },
    
}
localStorage.setItem('dailytaskdata', '')
localStorage.setItem('weeklytaskdata', '')
localStorage.setItem('monthlytaskdata', '')
localStorage.setItem('peroidicaltaskdata', '')
localStorage.setItem('prizepooldata', '')
localStorage.setItem('capabilitydata', '')
export const ClientFetch = {
    fetch (name:string, data?:any) {
        return new Promise(async resolve => {
            resolve(await requests[name](data))
        })
    }
}