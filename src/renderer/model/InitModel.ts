import {DailyInstance} from './DailyModel'
import { WeeklyTaskModel } from './WeeklyModel'
import { ClientFetch } from './ClientFetch'
import { MonthlyTaskModel } from './MonthlyModel'
import { initPrizePool } from './PrizeModel'
import { PeroidicalModel } from './PeroidicalModel'
import {CapabilitySYS} from './CapabilitySys'
import { resolve } from 'path'

class InitModel {
    public dailyMod:DailyInstance|null = null
    public weeklyMod:WeeklyTaskModel | null = null
    public monthlyMod:MonthlyTaskModel | null = null
    public peroidicalMod:PeroidicalModel | null = null
    public capabilityMod:CapabilitySYS | null = null
    private _ready:Function | null = null
    private _flag: boolean = false
    constructor () {
        //初始化奖励池模型
        ClientFetch.fetch('getPrizePool').then((data:any) => {
            console.log(data)
            initPrizePool(data ? data : null)
            Promise.all([
            //初始化每日任务模型
                ClientFetch.fetch('getDailyTask'),
                //初始化每周任务模型
                ClientFetch.fetch('getWeeklyTask'),
                //初始化每月任务模型
                ClientFetch.fetch('getMonthlyTask'),
                //初始化阶段性任务模型
                ClientFetch.fetch('getPeroidicalTask'),
                //初始化战力系统模型
                ClientFetch.fetch('getCapability'),
            ]).then(([daily,week,month,peroid,capability])=>{
                this.initDailyTask(daily as any)
                this.initWeekTask(week as any)
                this.initMonthTask(month as any)
                this.initPeriodTask(peroid as any)
                this.initCapability(capability as any)

                this._flag = true
                if (this._ready) this._ready(true)
            })
        })
    }
    initDailyTask (data:Array<any>|null) {
        this.dailyMod = new DailyInstance(data)
    }
    initWeekTask (data:Object | null) {
        this.weeklyMod = new WeeklyTaskModel(data)
    }
    initMonthTask (data:Record<string,any> | null) {
        this.monthlyMod = new MonthlyTaskModel(data)
    }
    initPeriodTask (data:Record<string,any> | null) {
        this.peroidicalMod = new PeroidicalModel(data)
    }
    initCapability (data: Record<string, any> | null) {
        this.capabilityMod = new CapabilitySYS(data)
    }
    ready () {
        return new Promise(resolve => {
            if (this._flag) {
                resolve(true)
            } else {
                this._ready = resolve
            }
        })
    }
}

const model = new InitModel()
export default model