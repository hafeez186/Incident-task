// Service Worker for offline functionality and push notifications
const CACHE_NAME = 'incident-management-v1'
const OFFLINE_URL = '/offline'

// Files to cache for offline use
const FILES_TO_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  // Add your critical assets here
]

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell')
        return cache.addAll(FILES_TO_CACHE)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  console.log('Service Worker fetching:', event.request.url)
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response for caching
          const responseClone = response.clone()
          
          // Cache successful API responses
          if (response.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          
          return response
        })
        .catch(() => {
          // Return cached API response if available
          return caches.match(event.request)
            .then((response) => {
              if (response) {
                return response
              }
              
              // Return offline data for critical endpoints
              if (event.request.url.includes('/api/mobile/tickets')) {
                return new Response(JSON.stringify({
                  tickets: [],
                  offline: true,
                  message: 'Offline mode - limited functionality'
                }), {
                  headers: { 'Content-Type': 'application/json' }
                })
              }
              
              throw new Error('No cached response available')
            })
        })
    )
    return
  }

  // Handle page requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response
        }
        
        // Fetch from network
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone)
              })
            }
            
            return response
          })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match(OFFLINE_URL)
        }
        
        throw new Error('Network request failed and no cache available')
      })
  )
})

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event)
  
  let notificationData = {
    title: 'Incident Management Alert',
    body: 'You have a new notification',
    icon: 'icons/icon-192x192.png',
    badge: 'icons/badge-72x72.png',
    data: {}
  }

  if (event.data) {
    try {
      const data = event.data.json()
      notificationData = { ...notificationData, ...data }
    } catch (e) {
      notificationData.body = event.data.text()
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    data: notificationData.data,
    actions: notificationData.actions || [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: notificationData.data?.priority === 'high',
    tag: notificationData.data?.ticketId || 'general'
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  // Handle notification click
  const urlToOpen = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window if app not already open
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag)
  
  if (event.tag === 'sync-tickets') {
    event.waitUntil(syncOfflineTickets())
  }
})

// Sync offline tickets when connection is restored
async function syncOfflineTickets() {
  try {
    // Get offline tickets from IndexedDB or localStorage
    const offlineTickets = await getOfflineTickets()
    
    for (const ticket of offlineTickets) {
      try {
        const response = await fetch('/api/mobile/tickets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(ticket)
        })
        
        if (response.ok) {
          await removeOfflineTicket(ticket.id)
          console.log('Synced offline ticket:', ticket.id)
        }
      } catch (error) {
        console.error('Failed to sync ticket:', ticket.id, error)
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error)
  }
}

// Helper functions (implement based on your storage choice)
async function getOfflineTickets() {
  // Implement: get tickets stored offline
  return []
}

async function removeOfflineTicket(ticketId) {
  // Implement: remove synced ticket from offline storage
  console.log('Removing offline ticket:', ticketId)
}
