// public/firebase-messaging-sw.js
 
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Use environment variables or fallback to hardcoded values
const firebaseConfig = {
  apiKey: "AIzaSyAizbXlDcLLYrlHWIjaoIXrBput5RDobPQ",
  authDomain: "rely-crm-13190.firebaseapp.com",
  projectId: "rely-crm-13190",
  storageBucket: "rely-crm-13190.firebasestorage.app",
  messagingSenderId: "111413366187",
  appId: "1:111413366187:web:fefe409d246b8f98de56ee",
  measurementId: "G-X1SQ5GT6WD",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  // Extract notification data
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: payload.notification?.image || '/logo.svg',
    badge: payload.notification?.image || '/logo.svg',
    image: payload.notification?.image || undefined,
    tag: payload.data?.tag || 'default',
    data: payload.data || {},
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Default action or 'open' action
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url.includes('/') && 'focus' in client) {
            return client.focus();
          }
        }

        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Handle push events
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || 'You have a new message',
      icon: payload.notification?.image || '/logo.svg',
      badge: payload.notification?.image || '/logo.svg',
      tag: payload.data?.tag || 'default',
      data: payload.data || {},
      requireInteraction: true
    };

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if any client (tab) is currently visible (in the foreground)
          const isAppInForeground = clientList.some(client => client.visibilityState === 'visible');
          
          if (isAppInForeground) {
            // App is in foreground, foreground listener in the app will handle showing the custom popup
            console.log('App is in foreground, skipping native notification');
            return;
          }

          // App is in background or not open, show native notification
          return self.registration.showNotification(notificationTitle, notificationOptions);
        })
    );
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
