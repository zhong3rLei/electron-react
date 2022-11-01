import {Prize, level,prizeType, prizePool_d} from './PrizeModel'
import { randomId } from 'renderer/utils/util'
import { ClientFetch } from './ClientFetch'
import InitModel from './InitModel'
import prizePool from './PrizeModel'
import channel from 'renderer/utils/channel'


export interface DailyTask {
    name: string
    id: string
    timeout: number
    finished:boolean
    finishTime: number | null
    beginTime: number | null
    receive: boolean
    prize: Prize
    [propsname:string]:any
}

class DailyTaskInstance implements DailyTask {
    public name: string
    public id: string
    public timeout: number
    public beginTime: number | null
    public finishTime: number | null
    public finished: boolean
    public receive: boolean
    public prize: Prize
    private _finish:Function[] = []
    private _change:Function[] = []
    private _receive: Function[] = []
    private _catchRemainingTime:Function = () => {}
    private _choosePrize (name:string):void {
        if (Array.isArray(this.prize.content) && this.prize.content.some(v =>v == name)) {
            this.prize.content = name
        }
        
        let prizeCtrler = prizePool.value
        prizeCtrler.add(this.prize)
    }
    private _getRemainingTime ():string {
        let rest = (this.beginTime as number) + this.timeout - new Date().getTime()
        let minute = Math.floor(rest / (60*1000))
        let second = Math.floor(rest%(60*1000) / 1000)
        return (minute > 9 ? minute : '0' + minute) + ":" + (second > 9 ? second : '0' + second)
    }
    private timer:any
    constructor (data:any) {
        this.name = data.name
        this.id = data.id
        this.timeout = data.timeout
        this.finished = data.finished
        this.receive = data.receive
        this.prize = data.prize
        this.beginTime = data.beginTime
        this.finishTime = data.finishTime

        //如果有开始时间说明已经开始，更新一下定时器状态
        if (this.beginTime) {
            this.update()
        }
    }
    //开始任务
    start ():void {
        let now = new Date().getTime()
        this.beginTime = now
        this._change.forEach(f=>f())
        this.update()
    }
    //完成任务
    finish () {
        this.finished = true
        this.beginTime = null
        this._finish.forEach(f=>f())
    }
    //更新计时器状态
    update ():void {
        const check = ():void => {
            if (!this.beginTime) return

            if (new Date().getTime() >= <number>this.beginTime + this.timeout) {
                this.finished = true
                this._finish.forEach(f=>f())
                this._change.forEach(f=>f())
                this.timer && clearInterval(this.timer)
            } else {
                //有可能是昨天的任务
                const nowDate = new Date().getDate()
                const beginDate = new Date(<number>this.beginTime).getDate()
                if (beginDate != nowDate) {
                    this.reload()
                }
            }
        }
        check()
        this.timer = setInterval(()=>{
            this._catchRemainingTime(this._getRemainingTime())
            check()
        },1000)
    }
    //获取当前任务的数据结构
    getValue ():DailyTask {
        return {
            name: this.name,
            id: this.id,
            timeout: this.timeout,
            beginTime: this.beginTime,
            finishTime:this.finishTime,
            finished: this.finished,
            receive: this.receive,
            prize: this.prize
        }
    }
    //重载当前任务
    reload ():void {
        this.beginTime = null
        this.finishTime = null
        this.finished = false
        this.receive = false
        this._change.forEach(f=>f())
        this.prize.content = prizePool_d
    }
    //领取奖励
    receiveAward (call:Function) {
        let _resolve:any
        let promise = new Promise(resolve => {
            _resolve = resolve
        })
        promise.then(name =>{
            this.receive = true
            this._choosePrize(<string>name)
            this._change.forEach(f=>f())
        })
        call((...arg:any[])=>{
            _resolve(...arg)
            if (this.name.includes('每日单词')) {
                //通知月模型签到
                InitModel.monthlyMod?.signIn()
            }
            if (this.name == '每日单词' || this.name == '每日听力' || this.name == '每日阅读') {
                channel.send('change-peroidical')
            }



            //阶段性累计模型
            switch (this.name) {
                case '每日单词':
                    InitModel.peroidicalMod?.add('words', 20)
                    break
                case '每日听力':
                    InitModel.peroidicalMod?.add('listen', 2)
                    break
                case '每日阅读':
                    InitModel.peroidicalMod?.add('read', 1)
                    break
            }
            this._receive.forEach(f=>f())
        })
    }
    //定时器结束回调
    onFinish (call:Function):void {
        let self = this
        this._finish.push(function () {
            self.finishTime = new Date().getTime()
            
            call(...arguments)
        })
    }
    //任务内容发生变化回调
    onChange (call:Function) {
        this._change.push(call)
    }
    //任务奖励领取回调
    onReceive (call:Function) {
        this._receive.push(call)
    }
    //计时器剩余时间回调
    onCatchRemainingTime (call:Function) {
        this._catchRemainingTime = call
    }
}


interface  model  {
    source: DailyTask[]
    get (id:string):DailyTask 
    [propsname:string]:any
}   

export class DailyInstance implements model {
    public source: DailyTask[]
    public proceed: number = -1
    public activity:number = 0
    constructor (data:Record<string, any> | null) {
        if (data) {
            this.source = data.source.map((v:any) => {
                let task = new DailyTaskInstance(v)
                task.onFinish(()=>{
                    this.uploadData()
                })
                task.onChange(()=>{
                    this.uploadData()
                })
                task.onReceive(()=>{
                    this.proceed++
                    this.activity += task.prize.activity
                    this.uploadData()
                })
                return task
            })
            this.proceed = data.proceed
            this.activity = data.activity
        } else {
            this.source = [
                {
                    name: '每日单词',
                    id: randomId(),
                    timeout: 30*60*1000,
                    beginTime: null,
                    finishTime: null,
                    finished: false,
                    receive: false,
                    prize: {
                        id: randomId(),
                        lv: level.D,
                        type: prizeType.daily,
                        onlyToday: true,
                        capability: 2500,
                        activity: 25,
                        content: prizePool_d
                    }
                },
                {
                    name: '每日单词复习',
                    id: randomId(),
                    timeout: 30*60*1000,
                    beginTime: null,
                    finishTime: null,
                    finished: false,
                    receive: false,
                    prize: {
                        id: randomId(),
                        lv: level.D,
                        type: prizeType.daily,
                        onlyToday: true,
                        capability: 2500,
                        activity: 25,
                        content: prizePool_d
                    }
                },
                {
                    name: '每日听力',
                    id: randomId(),
                    timeout: 30*60*1000,
                    beginTime: null,
                    finishTime: null,
                    finished: false,
                    receive: false,
                    prize: {
                        id: randomId(),
                        lv: level.D,
                        type: prizeType.daily,
                        onlyToday: true,
                        capability: 2500,
                        activity: 25,
                        content: prizePool_d
                    }
                },
                {
                    name: '每日阅读',
                    id: randomId(),
                    timeout: 30*60*1000,
                    beginTime: null,
                    finishTime: null,
                    finished: false,
                    receive: false,
                    prize: {
                        id: randomId(),
                        lv: level.D,
                        type: prizeType.daily,
                        onlyToday: true,
                        capability: 2500,
                        activity: 25,
                        content: prizePool_d
                    }
                }
            ].map(v=>{
                let task = new DailyTaskInstance(v)
                task.onFinish(()=>{
                    this.uploadData()
                })
                task.onChange(()=>{
                    this.uploadData()
                })
                task.onReceive(()=>{
                    this.proceed++
                    this.activity += task.prize.activity
                    this.uploadData()
                })
                return task
            })
        }

        const now = new Date()

        //检查任务每过一天更新一下
        const checkUpdata = () => {

            this.source.forEach(v=>{
                if (v.beginTime) {
                    let beginDate = new Date(v.beginTime).getDate()
                    if (now.getDate() != beginDate && now.getTime() > v.beginTime) {
                        v.reload()
                    }
                } else if (v.finished && v.finishTime) {
                    let finishDate = new Date(v.finishTime).getDate()
                    if (now.getDate() != finishDate && now.getTime() > v.finishTime) {
                        v.reload()
                    }
                }
            })
        }
        checkUpdata()

        //检查是否在程序运行期间跨越了0点
        const oldDate = now.getDate()
        let timer = setInterval(()=>{
            const newDateObject = new Date()
            const newDate = newDateObject.getDate()
            if (newDate != oldDate) {
                this.source.forEach(v=>{
                    v.reload()
                })
                clearInterval(timer)
            }
        },60000)

    }
    uploadData () {
        ClientFetch.fetch('setDailyTask', this.getValue())
    }
    getValue (): Record<string,any> {
        return {
            source: [...this.source.map(v=>v.getValue())],
            proceed: this.proceed,
            activity: this.activity
        }
    }
    get (id:string):DailyTask {
        return <DailyTask>this.source.find(v=> v.id == id)
    }
    beginTaskById (id:string):Object {
        let target:null|DailyTask = null
        let isBegin:boolean = false
        for (let i = 0; i < this.source.length; i++) {
            let task = this.source[i]
            if (task.id == id && task.beginTime == null) {
                target = task
            } else if (task.id != id && task.beginTime != null) {
                isBegin = true
            }
        }
        if (!isBegin && target) {
            target.start()
        }
        return {
            then (call:Function) {
                call(!isBegin && target ? true : false)
            }
        }
    }
}