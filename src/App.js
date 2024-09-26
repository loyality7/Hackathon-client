import React from 'react';  
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import Home from './pages/Home';
import Login from './pages/Login'; // Assuming you have this component
import AdminDashboard from './components/admin/AdminDashboard'; // Assuming you have this component
import HackathonManager from './components/admin/HackathonManager';
import UserManager from './components/admin/UserManager';
import ReportsManager from './components/admin/ReportsManager';
import HackathonList from './components/user/HackathonList';
import HackathonMain from './components/user/HackathonMain';
import HackathonDuplicate from './pages/HackathonDuplicate';
import UserDashboard from './components/user/UserDashboard';
import LeaderBoard from './pages/LeaderBoard';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/nexterchatadmin" element={<AdminDashboard />}>
            <Route path="hackathons" element={<HackathonManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="reports" element={<ReportsManager />} />
          </Route>
          <Route path="/hackathons" element={<HackathonList />} />
          <Route path="/hackathon/:id" element={<HackathonMain />} />
          <Route path="/hackathonDuplicate" element={<HackathonDuplicate />} />
          <Route path="/dashboard" element={<UserDashboard />} />          
          <Route path="/leaderboard" element={<LeaderBoard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
