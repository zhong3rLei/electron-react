import 'antd/dist/antd.css';
import {Button,Modal,Steps, Segmented, Card} from 'antd'
import {useState,useEffect} from "react"
import prizePool from 'renderer/model/PrizeModel';
import './style.css'
import TaskHOC from 'renderer/HOC/TaskHOC';
import channel from 'renderer/utils/channel';


export default TaskHOC('/bag')((props:any) => {
    const gridStyle: React.CSSProperties = {
        width: '25%',
        textAlign: 'center',
    };
    const loadData = () => {
        console.log(prizePool)
        let data = prizePool.value
    }
    loadData()
    let [list,setList] = useState(prizePool.value.dailyPrize)
    channel.on('change-prizepool', () => {
        loadData()
    })
    const tabChange = (name: any) => {
        switch (name) {
            case '每日任务奖励':
                setList(prizePool.value.dailyPrize)
                break;
            
        }
    }
    return (
        <>
            <div className="modal-item">
                <Segmented block options={['每日任务奖励','每周任务奖励', '每月任务奖励', '成就奖励']} onChange={tabChange}/>
                <Card title={null} style={{marginTop: 10}}>
                    <Card.Grid style={gridStyle}>Content</Card.Grid>
                    <Card.Grid hoverable={false} style={gridStyle}>
                    Content
                    </Card.Grid>
                    <Card.Grid style={gridStyle}>Content</Card.Grid>
                    <Card.Grid style={gridStyle}>Content</Card.Grid>
                    <Card.Grid style={gridStyle}>Content</Card.Grid>
                    <Card.Grid style={gridStyle}>Content</Card.Grid>
                    <Card.Grid style={gridStyle}>Content</Card.Grid>
                </Card>
            </div>
        </>
    )
})