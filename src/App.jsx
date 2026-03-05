import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import EventPage from './components/EventPage';
import './index.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/event/:sectionId" element={<EventPage />} />
    </Routes>
  );
}