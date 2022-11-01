import { CloseOutlined} from '@ant-design/icons';
import './style.css'
import channel from 'renderer/utils/channel';

export default (path:string) => (OriginalComponent:React.FunctionComponent) => {
    
    const close = () => {
        channel.send('close-window',path)
    }

    return () => (
        
        <div className='task-wrapper'>
            <CloseOutlined className='close-btn' onClick={close}/>
            <OriginalComponent/>
        </div>
    )
}