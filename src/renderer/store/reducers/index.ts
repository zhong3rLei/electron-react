import { combineReducers } from 'redux' 
import monthlyTaskReducer from "./monthlyTaskReducer";
import weeklyTaskReducer from "./weeklyTaskReducer";
import capabilityReducer from "./capabilityReducer"

export default combineReducers({
    monthlyTask: monthlyTaskReducer,
    weeklyTask: weeklyTaskReducer,
    capability: capabilityReducer
})
