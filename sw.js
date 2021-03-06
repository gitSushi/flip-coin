const appShellFiles = [
  "./index.html",
  "./src/style.css",
  "./images/gitsushi192.png",
  // "./images/toss_button.png",
  // "./src/three.min.js",
  // "./src/OrbitControls.js",
  // "./src/GLTFLoader.js",
  // "./src/app.js",
  // "./3d/lossushi_coin.gltf",
  // "./3d/lossushi_coin.bin"
];

self.addEventListener("install", (e) => {
  console.log("Installed !");
  e.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll(appShellFiles);
    })
  );
});

// having a fetch request means the app can be installed
self.addEventListener("fetch", (e) => {
  console.log(`Intercepting fetch request for : ${e.request.url}`);
  e.respondWith(
    caches.match(e.request).then((response) => {
      // return the cache or return to the network
      return response || fetch(e.request);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});
