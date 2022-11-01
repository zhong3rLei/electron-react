import {Badge,Button,Modal,Card,Progress,Input} from 'antd'
import { useEffect, useState } from 'react';
import InitModel from 'renderer/model/InitModel'
import {useWatchWeeklyActivity} from './function'
import SelectAward from 'renderer/base/SelectAward';
import './style.css'
import TaskHOC from 'renderer/HOC/TaskHOC';
import channel from 'renderer/utils/channel';


export default TaskHOC('/weeklytask')(() => {
    const weekControler:any = InitModel.weeklyMod
    
    let [percent,setPercent] = useState(0)
    let [activity, setActivity] = useState(0)
    InitModel.ready().then(()=>{
        setActivity(InitModel.weeklyMod?.activity || 0)
        setPercent(100 * ((InitModel.weeklyMod?.activity || 0) / 700))
    })
    channel.on('change-activity', () => {
        debugger
        setActivity(InitModel.weeklyMod?.activity || 0)
        setPercent(100 * ((InitModel.weeklyMod?.activity || 0) / 700))
    })
    const canTest = ():boolean => {
        let now = new Date()
        let day = now.getDay()
        return day != 6 && day != 1
    }
    let score = 0
    const scoreChange = (event:any) => {
        score = event.target.value
    }
    let [awardList,setAwardList] = useState([])
    const receiveWeeklyAward = async () => {
        if(percent < 100) return
        setAwardList(weekControler.prize.content)
        SelectAward.show(true)
        let name = await SelectAward.onSelect()
        weekControler.receiveWeeklyAward(name)
    }
    const receiveTestAward = async () => {
        if (score<=0) return
        setAwardList(weekControler.test.prize.content)
        SelectAward.show(true)
        let name = await SelectAward.onSelect()
        weekControler.receiveTestAward(name, score)
    }
    return (
        <>
                <div className="modal-item" style={{height: 400}}>
                    <div style={{marginBottom: '20px'}}>
                        <Card className='daily-card'>
                            活跃度
                            <Progress
                                style={{display: 'inline-block', width: '65%',marginLeft: 20}}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#87d068',
                                }}
                                format={()=>null}
                                percent={percent}
                            />
                            <Button className='control' type={percent < 100 ? "text" : 'primary'} onClick={receiveWeeklyAward}>{percent < 100 ? activity + "/ 700" : '领取'}</Button>
                        </Card>
                        <Card className='daily-card'>
                            单词量测验(每周六、周日)
                            <Button style={{float: 'right',marginLeft: 20}} type='primary' disabled={canTest()} onClick={receiveTestAward}>提交</Button>
                            <Input onChange={scoreChange} placeholder='输入分数' disabled={canTest()} style={{display: 'inline-block',width: 120, float: 'right'}}/>
                        </Card>
                        
                    </div>
                </div>
            <SelectAward list={awardList}/>
        </>
    )
})