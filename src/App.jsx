import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Topics from './pages/Topics';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Materials from './pages/Materials';
import Terms from './pages/Terms';

function RequireAuth({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-ink-soft dark:text-paper/60">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main className="container mx-auto w-full flex-1 px-4 py-6 sm:px-8 lg:px-12">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/topics" replace />} />
              <Route element={<RequireAuth />}>
                <Route path="/topics" element={<Topics />} />
                <Route path="/quiz/:topicId" element={<Quiz />} />
                <Route path="/result/:topicId" element={<Result />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/scores" element={<Leaderboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/materials" element={<Materials />} />
              </Route>
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </main>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
