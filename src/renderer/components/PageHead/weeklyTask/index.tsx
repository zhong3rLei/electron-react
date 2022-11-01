import {Badge,Button} from 'antd'
import { HistoryOutlined} from '@ant-design/icons';
import channel from 'renderer/utils/channel';

export default () => {
    
    const open = () => {
        channel.send('new-window','/weeklytask')
    }
    return (
        <>
            <div className="head-item">
                <Badge dot={true}>
                    <Button icon={<HistoryOutlined />} className="head-btn" size="large" onClick={open}></Button>
                </Badge>
                <p>每周任务</p>
            </div>
        </>
    )
}