import InitModel from './InitModel'
import channel from 'renderer/utils/channel'
import { ClientFetch } from './ClientFetch'

export enum level {
    SS = 1,
    S,
    A,
    B,
    C,
    D
}

export const prizePool_ss = [
    ''
]
export const prizePool_s = [
    ''
]
export const prizePool_a = [
    ''
]
export const prizePool_b = [
    '蛋黄卷',
    '好丽友派',
    '好丽友泡菜味薯片',
    '地瓜干',
    '锅巴',
    '奥利奥',
    '雪媚娘蛋黄酥',
    '酒鬼花生仁'
]
export const prizePool_c = [
    '恰恰瓜子',
    '山楂球',
    '炭烧腰果',
    '卫龙亲嘴烧',
    '红枣核桃饼',
    '开心果'
]
export const prizePool_d = [
    '30分钟按摩椅体验券1张',
    '30分钟抖音使用券1张',
    '30分钟游戏体验券1张',
    '60分钟电视观看券1张'

]
export enum prizeType  {
    daily,
    weekly,
    monthly,
    periodical,
    capability,
    achievement
}
export interface Prize {
    lv: level,
    id: string,
    onlyToday: boolean,
    type: prizeType,
    content: string | string[],
    capability: number
    activity:number
}

class PrizePool {
    public source:Prize[] = []
    public dailyPrize: Array<Prize>[] = []
    public weeklyPrize: Array<Prize>[] = []
    public monthlyPrize: Array<Prize>[] = []
    public peroidPrize: Array<Prize>[] = []
    public achievementPrize: Array<Prize>[] = []
    private distinguishAdd (arr:Array<Prize>[], prize:Prize) {
        if (Array.isArray(prize.content)) return
        if (prize.capability) {
            //战力系统增加战力
            InitModel.capabilityMod?.add(prize.capability)
            channel.send('change-capability')
        }
        if (prize.activity) {
            //通知周模型修改活跃度
            InitModel.weeklyMod?.addActivity(prize.activity)
            channel.send('change-activity')
        }
        let target = arr.find(v => v.some(el=> el.type == prize.type && el.content == prize.content))
        if (target) {
            target.push(prize)
        } else {
            arr.push([prize])
        }

        channel.send('change-prizepool')
    }
    constructor (data:Array<Prize> | null) {
        if (!data) return;

        this.source = data;
        
        (data as Array<any>).forEach(v=>{
            switch (v.type) {
                case prizeType.daily:
                    this.distinguishAdd(this.dailyPrize,v)
                    break;
                case prizeType.weekly:
                    this.distinguishAdd(this.weeklyPrize,v)
                    break;
                case prizeType.monthly:
                    this.distinguishAdd(this.monthlyPrize,v)
                    break;
                case prizeType.periodical:
                    this.distinguishAdd(this.peroidPrize,v)
                    break;
                case prizeType.capability:
                case prizeType.achievement:
                    this.distinguishAdd(this.achievementPrize,v)
                    break;

            }
        })
    }
    add (prize:Prize) {
        this.source.push(prize)
        
        switch (prize.type) {
            case prizeType.daily:
                this.distinguishAdd(this.dailyPrize,prize)
                break;
            case prizeType.weekly:
                this.distinguishAdd(this.weeklyPrize,prize)
                break;
            case prizeType.monthly:
                this.distinguishAdd(this.monthlyPrize,prize)
                break;
            case prizeType.periodical:
                this.distinguishAdd(this.peroidPrize,prize)
                break;
            case prizeType.capability:
            case prizeType.achievement:
                this.distinguishAdd(this.achievementPrize,prize)
                break;

        }
        
        this.upload()
    }
    clearDailyPrize () {
        this.dailyPrize = []
    }
    getValue() {
        return [...this.source]
    }
    upload () {
        ClientFetch.fetch('setPrizePool',this.getValue())
    }

}

let prizePool:Record<string,any> = {
    value: null
}

export function initPrizePool (data:Array<Prize> | null) {
    prizePool.value = new PrizePool(data)
}

export default prizePool