import {DailyTask} from '../../../model/DailyModel'
export const getDailyTaskList = (dailyControl:any) => dailyControl.getValue().source.map((v:DailyTask) => ({...v,remaintime: '点击开始'}))