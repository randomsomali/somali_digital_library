//main.jsx
import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './providers/ThemeProvider'
import ErrorBoundary from './components/ErrorBoundary'
import { Toaster } from './components/ui/toaster'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <AuthProvider>
        <ErrorBoundary> {/* Wrap your App with ErrorBoundary */}
          <App />
          <Toaster />
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)