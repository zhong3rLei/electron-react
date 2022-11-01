import {actionType,Actions} from '../actions/index'

const weeklyTaskReducer = (state = {adding: false}, action:actionType) => {
    switch (action.type) {
        case Actions.weeklyActivityADD:
            return {
                adding: true
            }
        case Actions.weeklyActivityADDOVER:
            return {
                adding: false
            }
        default:
            return state
    }
}
export default weeklyTaskReducer