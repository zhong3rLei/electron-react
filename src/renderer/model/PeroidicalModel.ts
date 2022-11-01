import {Prize, level, prizeType, prizePool_a, prizePool_s} from './PrizeModel'
import {randomId,randomInt} from '../utils/util'
import prizePool from './PrizeModel'
import { ClientFetch } from './ClientFetch'
import channel from 'renderer/utils/channel'

type KEY = "words" | "listen" | 'read'
export class PeroidicalModel {
    public words:Record<string,any> = {
        count: 0,
        map: []
    }
    public read:Record<string,any> = {
        count: 0,
        map: []
    }
    public listen:Record<string,any> = {
        count: 0,
        map: []
    }
    private initMap (data:Record<string,any> | null,key: KEY) {
        if (data && data[key]) {
            this[key].count = data[key].count
            let length = data[key].map.length
            if (!data[key].map[length - 1].finished) {
                this[key].map = data[key].map
            } else {
                this.generateMap(data[key].map[length - 1].target, length + 1, key)
            }
        } else {
            let target = 0
            this.generateMap(0, 4, key)
        }
    }
    private generateMap (count:number,length:number,key: KEY) {
        let target = count

        enum rule_a {
            words = 300,
            read = 15,
            listen = 30
        }
        enum rule_s {
            words = 1000,
            read = 50,
            listen = 100
        }
        enum rule_step {
            words = 100,
            read = 5,
            listen = 10
        }
        while (this[key].map.length < length) {
            target+= rule_step[key]
            if (target % rule_s[key] == 0) {
                this[key].map.push({
                    id: randomId(),
                    finished: false,
                    target,
                    prize: {
                        lv: level.S,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.periodical,
                        content: prizePool_s[randomInt(prizePool_s.length) - 1]
                    }
                })
            } else if (target % rule_a[key] == 0) {
                this[key].map.push({
                    id: randomId(),
                    finished: false,
                    target,
                    prize: {
                        lv: level.A,
                        id: randomId(),
                        onlyToday: false,
                        capability: 0,
                        activity: 0,
                        type: prizeType.periodical,
                        content: prizePool_a[randomInt(prizePool_a.length) - 1]
                    }
                })
            }
        }
    }
    constructor (data:Record<string, any> | null) {
        this.initMap(data, 'words')
        this.initMap(data, 'read')
        this.initMap(data, 'listen')
    }
    getValue () {
        return {
            words:this.words,
            read: this.read,
            listen: this.listen
        }
    }
    add(key:KEY, num:number) {
        this[key].count += num
        let target = this[key].map.find((v:Record<string, any>) => !v.finished)
        if ((target as Record<string, any>).target <= this[key].count) {
            this.generateMap(target.target, this[key].map.length + 1, key)
        }
        this.uploadData()
        channel.send('change-peroidical')
    }
    receiveAward (id:string) {
        let target
        ["words" , "listen" , 'read'].forEach((key:string) => {
            this[<KEY>key].map.forEach((item:any) => {
                if (item.id == id) {
                    target = item
                }
            });
        })
        if (target) {
            (target as Record<string, any>).finished = true

            let prizeCtrler = prizePool.value
            prizeCtrler.add((target as Record<string, any>).prize)
            //更新奖池数据
            ClientFetch.fetch('setPrizePool',prizeCtrler.source)
            //更新月模型数据
            this.uploadData()
        }
        
    }
    uploadData () {
        ClientFetch.fetch('setPeroidicalTask',this.getValue())
    }
}