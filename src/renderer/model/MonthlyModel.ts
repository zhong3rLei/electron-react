import {Prize, level, prizeType, prizePool_a} from './PrizeModel'
import {randomId,getCurrentMonthDays} from '../utils/util'
import prizePool from './PrizeModel'
import { ClientFetch } from './ClientFetch'
import channel from 'renderer/utils/channel'

export class MonthlyTaskModel {
    public sign: boolean[] = new Array(getCurrentMonthDays()).fill(false)
    public prize:Prize = {
        lv: level.A,
        id: randomId(),
        onlyToday: false,
        capability: 100000,
        activity: 0,
        type: prizeType.monthly,
        content: prizePool_a
    }
    constructor (data:Record<string, any> | null) {
        if (new Date().getDate() != 1 && data) {
            this.sign = data.sign
        }
        data && (this.prize = data.prize)
    }
    getValue () {
        return {
            sign: this.sign,
            prize: this.prize
        }
    }
    signIn () {
        let date = new Date().getDate()
        this.sign[date - 1] = true
        this.uploadData()
        //状态管理发布月签到事件
        channel.send('change-data')
        channel.send('daily-sign')
    }
    receiveAward (name:string) {
        if (Array.isArray(this.prize.content) && this.prize.content.some(v=>v==name)) {
            this.prize.content = name
        }
        let prizeCtrler = prizePool.value
        prizeCtrler.add(this.prize)
        //更新奖池数据
        ClientFetch.fetch('setPrizePool',prizeCtrler.source)
        //更新月模型数据
        this.uploadData()
    }
    uploadData () {
        ClientFetch.fetch('setMonthlyTask',this.getValue())
    }
}