import PageHead from '../../components/PageHead/'
import 'antd/dist/antd.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import channel from 'renderer/utils/channel';
import InitModel from 'renderer/model/InitModel'


export default () => {
    let navigate = useNavigate()
    let route = location.href.split('?route=')[1]
    InitModel.ready().then(()=>{
        if (route) {
            navigate(route)
        }
    })
    
    channel.on('change-data', ()=>{
        
    })
    return (
      <div>
            <PageHead></PageHead>
      </div>
    );
};
