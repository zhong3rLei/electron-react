export type actionType = {
    type: number
    [propname: string]: any
}
export enum Actions {
    monthlySign,
    finishMonthlySign,
    weeklyActivityADD,
    weeklyActivityADDOVER,
    capabilityADD,
    capabilityADDOVER,
}
export const monthlySign = {
    type: Actions.monthlySign
}

export const finishMonthlySign = {
    type: Actions.finishMonthlySign
}

export const weeklyActivityAdd = {
    type: Actions.weeklyActivityADD
}


export const finishWeeklyActivityAdd = {
    type: Actions.weeklyActivityADDOVER
}

export const capabilityAdd = {
    type: Actions.capabilityADD
}

export const finishCapabilityAdd = {
    type: Actions.capabilityADDOVER
}