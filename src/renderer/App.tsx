import { MemoryRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Index from './view/index/'
import DailyTask from './view/DailyTask'
import WeeklyTask from './view/WeeklyTask'
import MonthlyTask from './view/MonthlyTask'
import PeroidicalTask from './view/PeroidicalTask';
import Bag from './view/Bag';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dailytask" element={<DailyTask />} />
        <Route path="/weeklytask" element={<WeeklyTask />} />
        <Route path="/monthlytask" element={<MonthlyTask />} />
        <Route path="/peroidicaltask" element={<PeroidicalTask />} />
        <Route path="/bag" element={<Bag />} />
      </Routes>
    </Router>
  );
}
