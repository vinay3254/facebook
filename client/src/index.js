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
            style: { background: '#0A3323', color: '#F7F4D5', boxShadow: '0 12px 28px rgba(10,51,35,0.4)', borderRadius: '12px', border: '1px solid rgba(131,153,88,0.25)' },
            success: { iconTheme: { primary: '#839958', secondary: '#0A3323' } },
          }}
        />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
