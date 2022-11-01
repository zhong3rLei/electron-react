import store from "renderer/store";
import {finishWeeklyActivityAdd} from 'renderer/store/actions'

export const useWatchWeeklyActivity = (call:Function) => {
    store.subscribe(()=>{
        let state = store.getState() 
        if (state.weeklyTask.adding) {
            call(state)
            store.dispatch(finishWeeklyActivityAdd)
        }
    })
}
