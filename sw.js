
const CACHE_NAME = 'void-relics-v2';
const assets = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap'
];

// 1. INSTALAÇÃO: Salva os arquivos e força a ativação
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('SW: Cacheando novos assets');
      return cache.addAll(assets);
    })
  );
});

// 2. ATIVAÇÃO: O "Faxineiro". Deleta qualquer cache que não seja o v2
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: Tenta buscar na rede primeiro. Se falhar (offline), usa o cache.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
