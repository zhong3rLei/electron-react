import {PropsWithChildren,useState} from 'react'
import { Modal,Card } from 'antd'
import { resolve } from 'path'
const {Meta} = Card
const {confirm} = Modal

let show:any = null, onSelect:any = null
const SelectAward = (prop: PropsWithChildren<any>) => {
    let [selectShow,setSelectShow] = useState(false)
    show = setSelectShow

    const selectHandler = (award:string) => {
        confirm({
            title: `请确认选则奖品：${award}`,
            onOk () {
                onSelect && onSelect(award)
                setSelectShow(false)
            }
        })
    }
    return (
    <Modal title='请选则一个奖品' closable={false} open={selectShow} footer={null} onCancel={()=>setSelectShow(false)}>
        <div className="modal-item" style={{overflow: 'auto'}}>
            {prop.list.map((award:string) => (
                <Card
                    hoverable
                    onClick={()=>selectHandler(award)}
                    key={award}
                    style={{ width: '45%',float: 'left', margin: '0 2.5% 10px' }}
                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                >
                    <Meta title={award}/>
                </Card>
            ))}
            
        </div>
    </Modal>
    )
}
SelectAward.show = (bol:boolean) => {
    show && show(bol)
}
SelectAward.onSelect = () => new Promise(resolve=>{
    onSelect = resolve
})

export default SelectAward