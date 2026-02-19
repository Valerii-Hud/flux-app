import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import { Route, Routes } from 'react-router-dom';
import RightPanel from './components/common/RightPanel';
import Sidebar from './components/common/Sidebar';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { useEffect } from 'react';
import useAuthStore from './store/useAuthStore';
const App = () => {
  const { checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:userName" element={<ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  );
};

export default App;
