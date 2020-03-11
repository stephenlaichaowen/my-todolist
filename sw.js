// SW Version
const version = '1.2'
const cacheName = 'my-todo-list'

// Static Cache - App Shell
const appAssets = [
  'index.html',  
  'all.css',
  'all.js',
  'https://cdn.jsdelivr.net/npm/vue/dist/vue.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js'
]

// SW Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(`${cacheName}-${version}`)
      .then(cache => cache.addAll(appAssets))
  )
})

// SW Activate
self.addEventListener('activate', e => {
  // Clean static cache
  let cleaned = caches.keys().then(keys => {
    keys.forEach(key => {
      if (key !== `${cacheName}-${version}` && key.match(`${cacheName}-`)) {
        return caches.delete(key)
      }
    })
  })
  e.waitUntil(cleaned)
})

// SW Fetch
self.addEventListener('fetch', e => {
  // App shell
  if (e.request.url.match(location.origin)) {
    e.respondWith(staticCache(e.request))
  }
})

// Static cache strategy - Cache First / Cache with Network Fallback
const staticCache = req => {
  return caches.match(req).then(cacheRes => {
    
    // Return cached response if found
    if(cacheRes) return cacheRes

    // Fall back to network
    return fetch(req).then(networkRes => {

      // Update cache with new response
      caches.open(`${cacheName}-${version}`)
      .then(cache => cache.put(req, networkRes))

      // Return Clone of Network Response
      return networkRes.clone()
    })

  })
}