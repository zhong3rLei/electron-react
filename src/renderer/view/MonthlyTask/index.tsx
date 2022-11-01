import {Button,Calendar,Progress} from 'antd'
import { useEffect, useState } from 'react';
import InitModel from 'renderer/model/InitModel'
import {useWatchMonthTaskSign} from './function'
import TaskHOC from 'renderer/HOC/TaskHOC';

export default TaskHOC('/monthlytask')(() => {
    const monthControler:any = InitModel.monthlyMod
    const nowDate = new Date()
    let [signs,setSigns] = useState(monthControler.sign)
    const dateCellRender = (moment:any) => {
        let nowMonth = nowDate.getMonth()
        if (moment.month() == nowMonth) {
            return <div className={signs[moment.date() - 1]? 'month-active-dot' : ''}></div>
        }
        return <div></div>
    }

    let [percent,setPercent] = useState(100 * signs.filter((v:boolean)=>v).length / signs.length)

    useEffect(()=>{
        useWatchMonthTaskSign((state:any)=>{
            setSigns(monthControler.sign)
            setPercent(100 * signs.filter((v:boolean)=>v).length / signs.length)
        })
    },[])
    return (
        <>
            <div className="modal-item" style={{height: 400}}>
                <div style={{marginBottom: '20px'}}>
                    <Progress
                        style={{display: 'inline-block', width: '80%'}}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                        format={()=>null}
                        percent={percent}
                    />
                    <Button type='primary' disabled={ percent < 100 } style={{float:'right'}}>领取</Button>
                </div>
                <Calendar
                    fullscreen={false}
                    dateCellRender={dateCellRender}
                    headerRender={()=>null}
                />
            </div>
        </>
    )
})