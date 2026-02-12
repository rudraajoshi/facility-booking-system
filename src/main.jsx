import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Temporarily disable MSW to use real backend
// async function enableMocking() {
//   if (process.env.NODE_ENV !== 'development') {
//     return;
//   }
//   const { worker } = await import('./mocks/browser');
//   await worker.start({
//     onUnhandledRequest: 'bypass',
//     quiet: false, 
//   });
//   console.log('MSW is ready');
// }

// enableMocking()
//   .then(() => {
//     ReactDOM.createRoot(document.getElementById('root')).render(
//       <App />
//     );
//   })
//   .catch((error) => {
//     console.error('Failed to start MSW:', error);
//     ReactDOM.createRoot(document.getElementById('root')).render(
//       <App />
//     );
//   });


ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);