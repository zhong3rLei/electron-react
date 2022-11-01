import {Badge,Button} from 'antd'
import { VerifiedOutlined } from '@ant-design/icons';
import channel from 'renderer/utils/channel';

export default () => {
    
    const open = () => {
        channel.send('new-window','/peroidicaltask')
    }
    return (
        <>
            <div className="head-item">
                <Badge dot={true}>
                    <Button icon={<VerifiedOutlined />} className="head-btn" size="large" onClick={open}></Button>
                </Badge>
                <p>成就任务</p>
            </div>
        </>
    )
}