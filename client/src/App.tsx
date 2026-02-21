import SignUpPage from './pages/auth/signup/SignUpPage';
import LoginPage from './pages/auth/login/LoginPage';
import HomePage from './pages/home/HomePage';
import { Navigate, Route, Routes } from 'react-router-dom';
import RightPanel from './components/common/RightPanel';
import Sidebar from './components/common/Sidebar';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import { useQuery } from '@tanstack/react-query';
import { api } from './utils/helpers/api';
import { HttpMethod, type User } from './types';
import LoadingSpinner from './components/common/LoadingSpinner';
const App = () => {
  const { data: authUser, isLoading } = useQuery<User>({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await api({
        endpoint: '/auth/check-auth',
        method: HttpMethod.GET,
      });
      return res || null;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={'/'} />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to={'/login'} />}
        />
        <Route
          path="/profile/:userName"
          element={authUser ? <ProfilePage /> : <Navigate to={'/login'} />}
        />
      </Routes>
      {authUser && <RightPanel />}
    </div>
  );
};

export default App;
