import {Badge,Button,Modal,Card,Segmented, Timeline,Statistic} from 'antd'
import { useEffect, useState } from 'react';
import InitModel from 'renderer/model/InitModel'
import SelectAward from 'renderer/base/SelectAward';
import './style.css'
import TaskHOC from 'renderer/HOC/TaskHOC';
import { SegmentedValue } from 'antd/lib/segmented';
import { randomInt } from 'renderer/utils/util';
import channel from 'renderer/utils/channel';


export default TaskHOC('/peroidicaltask')(() => {
    let [value,setValue] = useState<SegmentedValue>('战力成就')
    const tabChange = (val: SegmentedValue) => {
        setValue(val)
    }
    let [words,setWords] = useState(InitModel.peroidicalMod?.words)
    let [read,setRead] = useState(InitModel.peroidicalMod?.read)
    let [listen,setListen] = useState(InitModel.peroidicalMod?.listen)
    let [capability,setCapability] = useState(InitModel.capabilityMod)
    channel.on('change-peroidical', () => {
        setCapability(InitModel.capabilityMod)
    })
    const receive = (id:string, type?: boolean) => {
        if (type) {
            InitModel.capabilityMod?.receiveAward(id)
        } else {
            InitModel.peroidicalMod?.receiveAward(id)
        }
    }
    const timelineItem = (data:any,setData:Function) => {
        return (
                    
            <Timeline mode='left'>
                {
                    data?.map.map((v:any)=>(
                        <Timeline.Item label={v.target + '个'}>
                            {
                                v.finished ? (
                                    <Card
                                        hoverable
                                        style={{ width: 150,textAlign: 'center' }}
                                    >
                                        完成
                                    </Card>
                                ) : (
                                    <Card
                                        hoverable
                                        style={{ width: 150,textAlign: 'center' }}
                                    >
                                        <Button type='primary' disabled={data?.count < v.target} onClick={()=>receive(v.id)}>领取</Button>
                                    </Card>
                                )
                            }
                        </Timeline.Item>
                    ))
                }
                
            </Timeline>
        )
    }
    const content = (val:SegmentedValue) => {
        switch (val) {
            case '战力成就':
                return (
                    <Timeline mode='left'>
                        {
                            capability?.list.map((v:any)=>(
                                <Timeline.Item label={<Statistic title={null} value={v.score} />}>
                                    {
                                        v.receive ? (
                                            <Card
                                                hoverable
                                                style={{ width: 150,textAlign: 'center' }}
                                            >
                                                完成
                                            </Card>
                                        ) : (
                                            <Card
                                                hoverable
                                                style={{ width: 150,textAlign: 'center' }}
                                            >
                                                <Button type='primary' disabled={(capability?.capability || 0) < v.score} onClick={()=>receive(v.id, true)}>领取</Button>
                                            </Card>
                                        )
                                    }
                                </Timeline.Item>
                            ))
                        }
                        
                    </Timeline>
                )
            case '单词量成就':
                return (
                    timelineItem(words,setWords)
                )
            case '听力成就':
                return (
                    timelineItem(listen,setListen)
                )
            case '阅读成就':
                return (
                    timelineItem(read,setRead)
                )
        }
    }
    console.log(InitModel.capabilityMod)
    return (
        <>
            <div className="modal-item" style={{height: 400}}>
                <div style={{marginBottom: '20px'}}>
                    <Segmented options={['战力成就', '单词量成就', '听力成就', '阅读成就']} value={value} onChange={tabChange} />
                    <div style={{marginTop: 10, overflowY: 'auto',overflowX:'hidden',paddingTop: 20, height: 400}}>
                        {
                            content(value)
                        }
                    </div>
                
                </div>
            </div>
        </>
    )
})