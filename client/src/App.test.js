import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock any required context providers or router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>,
}));

// You might need to mock other context providers
// For example, if you have an AuthContext
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => <div>{children}</div>,
  useAuth: () => ({ isAuthenticated: false, isLoading: false }),
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
  });

  test('contains PesaGuru brand name somewhere in the document', () => {
    render(<App />);
    // This is a basic test assuming the brand name appears somewhere
    const brandElement = screen.queryByText(/PesaGuru/i);
    expect(brandElement).toBeInTheDocument();
  });

});