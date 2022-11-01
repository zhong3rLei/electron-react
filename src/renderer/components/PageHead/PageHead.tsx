import {Steps} from 'antd'
import './style.css'
import DailyTask from "./dailyTask/dailyTask";
import MonthlyTask from "./monthlyTask/index";
import WeeklyTask from "./weeklyTask/index";
import PeroidicalTask from "./peroidicalTask";
import Bag from "./bag";

const {Step} = Steps

export default () => {
    
    return (
        <>
            <div className="header">
                <DailyTask></DailyTask>
                <WeeklyTask></WeeklyTask>
                <MonthlyTask></MonthlyTask>
                <PeroidicalTask></PeroidicalTask>
                <Bag></Bag>
            </div>
            
        </>
    )
}