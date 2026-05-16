import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Show errors visually for debugging white screen
window.addEventListener('error', (e) => {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.zIndex = '99999';
  div.style.background = 'rgba(255,0,0,0.9)';
  div.style.color = 'white';
  div.style.padding = '20px';
  div.style.width = '100vw';
  div.textContent = `Uncaught Error: ${e.error?.message || e.message}`;
  document.body.appendChild(div);
});

window.addEventListener('unhandledrejection', (e) => {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '100px';
  div.style.left = '0';
  div.style.zIndex = '99999';
  div.style.background = 'rgba(255,0,0,0.9)';
  div.style.color = 'white';
  div.style.padding = '20px';
  div.style.width = '100vw';
  div.textContent = `Unhandled Promise Rejection: ${e.reason?.message || e.reason}`;
  document.body.appendChild(div);
});

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, whiteSpace: 'pre-wrap', fontFamily: 'monospace', width: '100vw', height: '100vh', background: 'white', color: 'red', zIndex: 9999, position: 'relative' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.error && this.state.error.stack}
          </details>
        </div>
      );
    }

    return (this as any).props.children; 
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

