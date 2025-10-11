import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as Sentry from "@sentry/react";

// Initialize Sentry for error monitoring and performance (conditionally enabled if DSN is provided)
if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE || import.meta.env.VITE_SENTRY_ENVIRONMENT || 'production',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    sendDefaultPii: true,
    sendClientReports: true,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    enableLogs: true,
    attachStacktrace: true,
    normalizeDepth: 10,
    initialScope: {
      tags: { app: 'finance-tracker' },
    },

  });
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  
                  // You can show a toast or modal here to ask user to refresh
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload();
                  }
                } else {
                  // Content is cached for offline use
                }
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.error('SW registration failed: ', registrationError);
      });
  });
}

// Handle app installation prompt
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // You can show your own install button here
  // For example, show a custom "Add to Home Screen" button
});

// Handle successful installation
window.addEventListener('appinstalled', (e) => {
    
  // You can track this event for analytics
});

createRoot(document.getElementById("root")).render(
  <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>}>
    <App />
  </Sentry.ErrorBoundary>
);
