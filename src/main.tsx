import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  console.log('New content is available; please refresh.');
                  
                  // You can show a toast or modal here to ask user to refresh
                  if (confirm('New version available! Refresh to update?')) {
                    window.location.reload();
                  }
                } else {
                  // Content is cached for offline use
                  console.log('Content is cached for offline use.');
                }
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Handle app installation prompt
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA: beforeinstallprompt event fired');
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // You can show your own install button here
  // For example, show a custom "Add to Home Screen" button
  console.log('PWA: Install prompt available');
});

// Handle successful installation
window.addEventListener('appinstalled', (e) => {
  console.log('PWA: App was installed', e);
  // You can track this event for analytics
});

createRoot(document.getElementById("root")).render(<App />);
