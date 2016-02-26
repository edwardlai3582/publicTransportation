importScripts('./serviceworker-cache-polyfill.js');

var staticCacheName = 'udacityCaltrain-static-v2';

self.addEventListener('install', function(event) {
    var urlsToCache = [
        '/',
        'xml2json.js',
        'bundle.js',
        'style.css',
        'GTFSCaltrainDevs/fare_attributes.txt',  
        'GTFSCaltrainDevs/fare_rules.txt', 
        'GTFSCaltrainDevs/routes.txt',
        'GTFSCaltrainDevs/stop_times.txt', 
        'GTFSCaltrainDevs/stops.txt',
        'GTFSCaltrainDevs/trips.txt'
    ];
    
    event.waitUntil(
        caches.open(staticCacheName).then(function(cache){
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('udacityCaltrain') && cacheName != staticCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })    
    );
});
