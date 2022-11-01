import {Badge,Button} from 'antd'
import { HistoryOutlined} from '@ant-design/icons';
import channel from 'renderer/utils/channel';

export default () => {
    let open = () => {
        channel.send('new-window','/monthlytask')
    }
    return (
        <>
            <div className="head-item">
                <Badge dot={true}>
                    <Button icon={<HistoryOutlined />} className="head-btn" size="large" onClick={open}></Button>
                </Badge>
                <p>每月任务</p>
            </div>
        </>
    )
}