import {actionType,Actions} from '../actions/index'

const monthlyTaskReducer = (state = {sign: false}, action:actionType) => {
    switch (action.type) {
        case Actions.monthlySign:
            return {
                sign: true
            }
        case Actions.finishMonthlySign:
            return {
                sign: false
            }
        default:
            return state
    }
}
export default monthlyTaskReducer