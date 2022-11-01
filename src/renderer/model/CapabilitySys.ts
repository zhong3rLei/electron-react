import {prizePool_a,prizePool_b, prizePool_s,level, prizeType} from './PrizeModel'
import prizePool from './PrizeModel'
import {ClientFetch} from './ClientFetch'
import { randomId } from 'renderer/utils/util'
export class CapabilitySYS {
    public capability:number = 0
    public list:Array<any> = []
    constructor (data: any) {
        if (data) {
            this.capability = data.capability
            this.list = data.list
            this.upDataList()
        } else {
            this.list = [
                {
                    id: randomId(),
                    score: 200000,
                    reach: false,
                    receive: false,
                    prize: {
                        lv: level.B,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.capability,
                        content: prizePool_b
                    }
                },
                {
                    id: randomId(),
                    score: 300000,
                    reach: false,
                    receive: false,
                    prize: {
                        lv: level.B,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.capability,
                        content: prizePool_b
                    }
                },
                {
                    id: randomId(),
                    score: 400000,
                    reach: false,
                    receive: false,
                    prize: {
                        lv: level.B,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.capability,
                        content: prizePool_b
                    }
                },
                {
                    id: randomId(),
                    score: 500000,
                    reach: false,
                    receive: false,
                    prize: {
                        lv: level.B,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.capability,
                        content: prizePool_b
                    }
                },
                {
                    id: randomId(),
                    score: 700000,
                    reach: false,
                    receive: false,
                    prize: {
                        lv: level.A,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.capability,
                        content: prizePool_a
                    }
                },
                {
                    id: randomId(),
                    score: 1000000,
                    reach: false,
                    receive: false,
                    prize: {
                        lv: level.S,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.capability,
                        content: prizePool_s
                    }
                }
            ]
        }
    }
    getValue() {
        return {
            list: this.list,
            capability:this.capability
        }
    }
    upDataList () {
        let lenth = this.list.length

        this.list = this.list.map(v=>({
            ...v,
            reach: this.capability > v.score
        }))
        if (this.capability >= this.list[lenth - 2].score) {
            this.list.push({
                id: randomId(),
                score: this.list[lenth - 1].score + 500000,
                reach: false,
                receive: false,
                prize: {
                    lv: (this.list[lenth - 1].score + 500000) % 1000000 == 0 ? level.S : level.A,
                    id: randomId(),
                    onlyToday: false,
                    capability: 0,
                    activity: 0,
                    type: prizeType.capability,
                    content: (this.list[lenth - 1].score + 500000) % 1000000 == 0 ? prizePool_s : prizePool_a
                }
            })
            this.uploadData()
        }
    }
    uploadData () {
        ClientFetch.fetch('setCapability', this.getValue())
    }
    add (num:number) {
        this.capability += num
        this.upDataList()
    }
    receiveAward (id:string) {
        let target = this.list.find(v => id == v.id)
        if (target) {
            target.receive = true
            
            let prizeCtrler = prizePool.value
            prizeCtrler.add(target.prize)
        }
    }
}