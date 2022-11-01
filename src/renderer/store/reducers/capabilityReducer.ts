import {actionType,Actions} from '../actions/index'

const capabilityReducer = (state = {adding: false}, action:actionType) => {
    switch (action.type) {
        case Actions.capabilityADD:
            return {
                adding: true
            }
        case Actions.capabilityADDOVER:
            return {
                adding: false
            }
        default:
            return state
    }
}
export default capabilityReducer