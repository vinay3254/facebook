import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#121414', color: '#F5E7C6', boxShadow: '0 12px 28px rgba(0,0,0,0.35)', borderRadius: '12px', border: '1px solid rgba(212,181,113,0.14)' },
            success: { iconTheme: { primary: '#D4B571', secondary: '#090B0B' } },
          }}
        />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
