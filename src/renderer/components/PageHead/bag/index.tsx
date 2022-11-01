import {Badge,Button} from 'antd'
import { GiftOutlined } from '@ant-design/icons';
import channel from 'renderer/utils/channel';

export default () => {
    let open = () => {
        channel.send('new-window','/bag')
    }
    return (
        <>
            <div className="head-item">
                <Badge dot={true}>
                    <Button icon={<GiftOutlined />} className="head-btn" size="large" onClick={open}></Button>
                </Badge>
                <p>我的奖品</p>
            </div>
        </>
    )
}