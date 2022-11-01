import {Prize, level, prizeType, prizePool_b, prizePool_c} from './PrizeModel'
import prizePool from './PrizeModel'
import {randomId} from '../utils/util'
import { ClientFetch } from './ClientFetch'

class WeeklyTest {
    public score: number = 0
    public prize: Prize = {
        lv: level.C,
        id: randomId(),
        onlyToday: false,
        capability: 0,
        activity: 0,
        type: prizeType.weekly,
        content: prizePool_c
    }
    public finished:boolean = false
    finish(score: number) {
        this.score = score
        this.finished = true
    }
    getValue () {
        return {
            score: this.score,
            prize: this.prize,
            finished: this.finished
        }
    }
    reload () {
        this.score = 0
        this.finished = false
        this.prize.content = prizePool_c
    }
    receiveAward (name:string, score:string | number) {
        if (Array.isArray(this.prize.content) && this.prize.content.some(v => v == name)) {
            this.prize.content = name
            this.prize.capability = Number(score)*50
        }
    }
}

export class WeeklyTaskModel {
    public activity: number = 0
    private cachetime: number = 0
    public prize: Prize = {
        lv: level.B,
        id: randomId(),
        onlyToday: false,
        capability: 35000,
        activity: 0,
        type: prizeType.weekly,
        content: prizePool_b
    }
    public finished: boolean = false
    public test: WeeklyTest = new WeeklyTest()
    constructor (data:any) {
        //有缓存且不是周一的情况下，用缓存数据初始化，否则第一次使用，或者每周的周一，都进行默认初始化
        if (data) {
            if (new Date().getDay() == 1) {
                if(data.cachetime && Math.abs(new Date().getTime() - data.cachetime) < 24*60*60*1000) {
                    //走缓存
                    this.cachetime = new Date().getTime()
                    this.activity = data.activity
                    this.prize = data.prize
                    this.finished = data.finished
                    this.test = data.test
                }
            } else {
                //走缓存
                this.cachetime = data.cachetime
                this.activity = data.activity
                this.prize = data.prize
                this.finished = data.finished
                this.test = data.test
            }
        }
    }
    getValue () {
        return {
            activity: this.activity,
            cachetime: this.cachetime,
            prize: this.prize,
            finished: this.finished,
            test: this.test
        }
    }
    receiveWeeklyAward (name:string) {
        this.prize.content = name
        let prizeCtrler = prizePool.value
        prizeCtrler.add(this.prize)
        //更新奖池数据
        ClientFetch.fetch('setPrizePool',prizeCtrler.source)
        //更新周模型数据
        this.uploadData()

    }
    receiveTestAward (name:string, score:string | number) {
        this.test.receiveAward(name, score)
        let prizeCtrler = prizePool.value
        prizeCtrler.add(this.test.prize)
        //更新奖池数据
        ClientFetch.fetch('setPrizePool',prizeCtrler.source)
        //更新周模型数据
        this.uploadData()
    }
    addActivity (num:number) {
        this.activity += num
        if (this.activity >= 700) {
            this.finished = true
        }
        this.uploadData()
    }
    uploadData () {
        if (new Date().getDay() == 1 && this.cachetime == 0) {
            this.cachetime = new Date().getTime()
        }
        //更新周模型数据
        ClientFetch.fetch('setWeeklyTask',this.getValue())
    }
    reload () {
        this.activity = 0
        this.test.reload()
        this.prize.content = prizePool_b
    }
}