import React, { createContext, useContext, ReactNode } from 'react';

interface HashConnectContextType {
  isConnected: boolean;
  accountId: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const HashConnectContext = createContext<HashConnectContextType | undefined>(undefined);

interface HashConnectProviderProps {
  children: ReactNode;
}

export const HashConnectProvider: React.FC<HashConnectProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [accountId, setAccountId] = React.useState<string | null>(null);

  const connect = async () => {
    // Placeholder for HashConnect implementation
    console.log('Connecting to wallet...');
    // Simulate connection
    setTimeout(() => {
      setIsConnected(true);
      setAccountId('0.0.123456');
    }, 1000);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccountId(null);
  };

  const value: HashConnectContextType = {
    isConnected,
    accountId,
    connect,
    disconnect,
  };

  return (
    <HashConnectContext.Provider value={value}>
      {children}
    </HashConnectContext.Provider>
  );
};

export const useHashConnect = () => {
  const context = useContext(HashConnectContext);
  if (context === undefined) {
    throw new Error('useHashConnect must be used within a HashConnectProvider');
  }
  return context;
}; 