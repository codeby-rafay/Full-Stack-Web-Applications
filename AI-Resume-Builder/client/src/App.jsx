import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ResumeEditor from './pages/ResumeEditor';
import AIBuilder from './pages/AIBuilder';
import TemplateGallery from './pages/TemplateGallery';

export const AuthContext = createContext(null);
export const ToastContext = createContext(null);

const API_URL = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
        } else {
          setUser({ id: payload.id, name: payload.name, email: payload.email });
        }
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, API_URL }}>
      <ToastContext.Provider value={{ addToast }}>
        <Router>
          <div className="animated-bg">
            <div className="orb"></div>
            <div className="orb"></div>
            <div className="orb"></div>
          </div>
          <Navbar />
          <div className="toast-container">
            {toasts.map(toast => (
              <div key={toast.id} className={`toast toast-${toast.type}`}>
                {toast.message}
              </div>
            ))}
          </div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/editor/:id" element={user ? <ResumeEditor /> : <Navigate to="/login" />} />
            <Route path="/editor/new" element={user ? <ResumeEditor /> : <Navigate to="/login" />} />
            <Route path="/ai-builder" element={user ? <AIBuilder /> : <Navigate to="/login" />} />
            <Route path="/templates" element={<TemplateGallery />} />
          </Routes>
        </Router>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
