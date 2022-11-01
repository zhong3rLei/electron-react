import 'antd/dist/antd.css';
import {Button,Modal,Steps, Divider, Card} from 'antd'
import {SmileOutlined, HourglassOutlined, CheckCircleOutlined, DollarOutlined} from '@ant-design/icons';
import {useState,useEffect} from "react"
import InitModel from 'renderer/model/InitModel'
import {getDailyTaskList} from './function'
import SelectAward from 'renderer/base/SelectAward'
import './style.css'
import TaskHOC from 'renderer/HOC/TaskHOC';
import channel from 'renderer/utils/channel';


const { confirm } = Modal;
const { Step } = Steps
export default TaskHOC('/dailytask')((props:any) => {
    
    channel.send('change-data')
    
    
    let dailyControl = InitModel.dailyMod

    let [dailyList,setDailyList] = useState(getDailyTaskList(dailyControl))
    let [step,setStep] = useState(dailyControl?.proceed)

    useEffect(()=>{
        /**遍历监听任务模型的事件**/
        dailyControl?.source.forEach(task => {
            task.onCatchRemainingTime((time:string)=>{
                let list = getDailyTaskList(dailyControl)
                list.find((v:any) => v.id == task.id).remaintime = time
                setDailyList(list)
            })

            task.onFinish(()=>{
                let list = getDailyTaskList(dailyControl)
                setDailyList(list)
            })
            task.onChange(()=>{
                let list = getDailyTaskList(dailyControl)
                setDailyList(list)
            })
        })
    },[])
    
    const getTaskState = (task:Record<string,any>) => {
        let {beginTime,timeout, finished, receive} = task
        let now = new Date().getTime()

        if (beginTime && now >= beginTime && now < beginTime + timeout) {
            return <HourglassOutlined />
        } else if (finished) {
            if (!receive) return <DollarOutlined />
            else return <CheckCircleOutlined />
        } else {
            return null
        }
    }

    const getTaskTxt = (task:Record<string,any>) => {
        let {beginTime,timeout,finished, receive} = task
        let now = new Date().getTime()

        if (beginTime && now >= beginTime && now < beginTime + timeout) {
            return task.remaintime
        } else if (finished) {
            if (!receive) return '领取奖励'
            else return '完成（点击重新开始）'
        } else {
            return '点击开始'
        }
    }

    let [awardList,setAwardList] = useState([])
    const controlTask =  (task:Record<string,any>) => {
        let {beginTime,id, timeout, finished,receive} = task
        let now = new Date().getTime()
        let target:any = dailyControl?.get(id)
        if ((!beginTime || now < beginTime) && !finished) {
            target.start()
        } else if (beginTime && now >= beginTime && now < beginTime + timeout) {
            confirm({
                title: '确定要完成任务吗？',
                onOk() {
                    target.finish()
                },
            })
        } else if (finished) {
            if (!receive) {
                target.receiveAward(async (choose:Function)=>{
                    setAwardList(target.prize.content)
                    SelectAward.show(true)
                    let award = await SelectAward.onSelect()
                    choose(award)
                    setStep(dailyControl?.proceed)
                })
            } else {
                target.reload()
                target.start()
            }
        }
    }
    return (
        <>
            <div className="modal-item">
                <Steps current={step}>
                    <Step title="25" />
                    <Step title="50" />
                    <Step title="75" />
                    <Step title="Done" icon={<SmileOutlined />} />
                </Steps>
                <Divider />
                {dailyList.map((task:any) => (
                    <Card className='daily-card' key={task.id}>
                        {task.name}
                        <Button className='control' type="text" icon={getTaskState(task)} onClick={()=>controlTask(task)}>{getTaskTxt(task)}</Button>
                    </Card>
                ))}
                
            </div>
            <SelectAward list={awardList}></SelectAward>
        </>
    )
})