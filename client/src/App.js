import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';

// Layout components
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen.jsx';

// Auth pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

// Main application pages
import Dashboard from './pages/Dashboard';
import ChatbotPage from './pages/Chatbot';
import InvestmentPlanning from './pages/Investment';
import LoanComparison from './pages/Loan';
import FinancialEducation from './pages/Education';
import UserProfile from './pages/Profile';

// Styles
import './App.css';
import './i18n'; // Initialize i18n

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { checkAuthStatus } = useAuth();
  
  useEffect(() => {
    // Check authentication status when app loads
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="investments" element={<InvestmentPlanning />} />
        <Route path="loans" element={<LoanComparison />} />
        <Route path="education" element={<FinancialEducation />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>
      
      {/* Catch-all redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AppContent />
    </div>
  );
}

export default App;