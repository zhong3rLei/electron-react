import store from "renderer/store";
import {finishMonthlySign} from 'renderer/store/actions'

export const useWatchMonthTaskSign = (call:Function) => {
    store.subscribe(()=>{
        let state = store.getState() 
        if (state.monthlyTask.sign) {
            call(state)
            store.dispatch(finishMonthlySign)

        }
    })
}
