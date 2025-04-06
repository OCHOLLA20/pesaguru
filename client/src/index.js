import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';
import './i18n';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatbotProvider } from './context/ChatbotContext';
import { LanguageProvider } from './context/LanguageContext';

// Initialize React Query client for API data fetching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 300000, // 5 minutes
    },
  },
});

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with all required providers
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <ChatbotProvider>
                <Toaster position="top-right" richColors closeButton />
                <App />
              </ChatbotProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Log initial message to console
console.log('PesaGuru Financial Advisory Application Initialized');

// Enable hot module replacement for development
if (import.meta.hot) {
  import.meta.hot.accept();
}