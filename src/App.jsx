import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import GenerateListing from './pages/GenerateListing';
import ListingHistory from './pages/ListingHistory';
import ListingDetails from './pages/ListingDetails';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid #1E293B',
              fontSize: '13px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#0F172A',
              },
            },
            error: {
              iconTheme: {
                primary: '#F43F5E',
                secondary: '#0F172A',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="generate" element={<GenerateListing />} />
            <Route path="history" element={<ListingHistory />} />
            <Route path="listing/:id" element={<ListingDetails />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
