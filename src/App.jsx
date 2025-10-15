import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SentimentProvider } from './context/SentimentContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <SentimentProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </SentimentProvider>
  );
}

export default App;
