import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HashConnectProvider } from '../hashconnect/HashConnectProvider';
import { MainLayout } from './MainLayout';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <HashConnectProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/balance" element={<BalancePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </HashConnectProvider>
    </BrowserRouter>
  );
};

// Placeholder components - replace with your actual components
const HomePage: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <h1>Welcome to Hedera dApp</h1>
    <p>Your multi-modal Hedera application is running successfully!</p>
    <div style={{ marginTop: '20px' }}>
      <h2>Available Features:</h2>
      <ul>
        <li>Wallet Connection</li>
        <li>HBAR Transfers</li>
        <li>Balance Checking</li>
        <li>Telegram Notifications</li>
      </ul>
    </div>
  </div>
);

const WalletPage: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <h1>Wallet Management</h1>
    <p>Connect and manage your Hedera wallet here.</p>
  </div>
);

const TransferPage: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <h1>Transfer HBAR</h1>
    <p>Send HBAR to other accounts.</p>
  </div>
);

const BalancePage: React.FC = () => (
  <div style={{ padding: '20px' }}>
    <h1>Check Balance</h1>
    <p>View your account balance and token holdings.</p>
  </div>
);

const NotFoundPage: React.FC = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

// Export as Router to match the import in App.tsx
export { AppRouter as Router }; 