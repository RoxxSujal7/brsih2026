import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './three/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary returnUrl="/timeline.html">
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
