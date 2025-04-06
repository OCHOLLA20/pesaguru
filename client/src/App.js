import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Page components
import Dashboard from './pages/Dashboard';
import ChatbotPage from './pages/Chatbot';
import InvestmentPlanning from './pages/InvestmentPlanning';
import LoanComparison from './pages/LoanComparison';
import FinancialEducation from './pages/Education';
import UserProfile from './pages/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Layout component
import Layout from './components/layout/Layout';

// Context providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatbotProvider } from './context/ChatbotContext';
import { ThemeProvider } from './context/ThemeContext';

// Import i18n for multilingual support
import './i18n';

// Protected route wrapper component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading PesaGuru...</p>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ChatbotProvider>
            <div className="app-container">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected routes with Layout */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="chatbot" element={<ChatbotPage />} />
                  <Route path="investments" element={<InvestmentPlanning />} />
                  <Route path="loans" element={<LoanComparison />} />
                  <Route path="education" element={<FinancialEducation />} />
                  <Route path="profile" element={<UserProfile />} />
                </Route>
                
                {/* Fallback route - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </ChatbotProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;