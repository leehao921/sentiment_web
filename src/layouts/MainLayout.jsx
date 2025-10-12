import React from 'react';
import './MainLayout.css';

function MainLayout({ children }) {
  return (
    <div className="main-layout">
      <header className="header">
        <h1>情感分析儀表板</h1>
      </header>
      <main className="content">
        {children}
      </main>
      <footer className="footer">
        <p>&copy; 2025 情感分析系統</p>
      </footer>
    </div>
  );
}

export default MainLayout;
