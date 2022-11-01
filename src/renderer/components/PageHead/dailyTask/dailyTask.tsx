import {Badge,Button} from 'antd'
import { HistoryOutlined} from '@ant-design/icons';
import channel from 'renderer/utils/channel';


export default (props:any) => {
    
    const openDailyTask = () => {
        channel.send('new-window','/dailytask')
    }
    
    return (
        <>
            <div className="head-item">
                <Badge dot={true}>
                    <Button icon={<HistoryOutlined />} className="head-btn" size="large" onClick={openDailyTask}></Button>
                </Badge>
                <p>每日任务</p>
            </div>
        </>
    )
}