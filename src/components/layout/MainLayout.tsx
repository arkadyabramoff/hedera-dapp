import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <header style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <h1>Hedera dApp</h1>
        <nav style={{ marginTop: '1rem' }}>
          <a href="/" style={{ color: 'white', margin: '0 1rem', textDecoration: 'none' }}>Home</a>
          <a href="/wallet" style={{ color: 'white', margin: '0 1rem', textDecoration: 'none' }}>Wallet</a>
          <a href="/transfer" style={{ color: 'white', margin: '0 1rem', textDecoration: 'none' }}>Transfer</a>
          <a href="/balance" style={{ color: 'white', margin: '0 1rem', textDecoration: 'none' }}>Balance</a>
        </nav>
      </header>
      
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
      
      <footer style={{
        backgroundColor: '#34495e',
        color: 'white',
        textAlign: 'center',
        padding: '1rem',
        position: 'fixed',
        bottom: 0,
        width: '100%'
      }}>
        <p>Powered by Hedera Hashgraph</p>
      </footer>
    </div>
  );
}; 