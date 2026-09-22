// Service Worker do CodGenesis - Armazenamento offline (PWA)

const CACHE_NAME = "codgenesis-cache-v3";

// Recursos fundamentais que precisam ser cacheados para uso offline imediato
const ASSETS_TO_CACHE = [
  "index.html",
  "login.html",
  "cadastro.html",
  "trilhas.html",
  "aulas.html",
  "aula.html",
  "quiz.html",
  "progresso.html",
  "owner.html",
  "professor.html",
  "perfil.html",
  "css/style.css",
  "data/conteudos.js",
  "js/config.js",
  "js/supabase-client.js",
  "js/auth.js",
  "js/offline.js",
  "js/trilhas.js",
  "js/tarefas.js",
  "js/aulas.js",
  "js/aula.js",
  "js/quiz.js",
  "js/progresso.js",
  "js/owner.js",
  "js/professor.js",
  "js/perfil.js",
  "js/comentarios.js",
  "manifest.json",
  "assets/imagens/logo.svg",
  // Cachear a biblioteca do Supabase importada via CDN para permitir carregamento offline
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
];

// Evento de instalação - Carrega os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Cacheando arquivos essenciais.");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Evento de ativação - Limpa caches antigos se necessário
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Limpando cache antigo:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Evento de busca (fetch) - Estratégia Cache-First com fallback de rede
// Isso assegura que se estiver offline, o app carregará instantaneamente do cache.
self.addEventListener("fetch", (event) => {
  // Ignorar requisições ao banco de dados do Supabase (essas devem falhar na rede se offline)
  if (event.request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Retorna do cache se encontrar
        return cachedResponse;
      }
      
      // Caso contrário, busca na rede
      return fetch(event.request).then((networkResponse) => {
        // Se for uma requisição bem sucedida, podemos colocá-la no cache dinamicamente
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn("Falha de rede ao buscar recurso:", event.request.url, err);
        if (event.request.mode === "navigate") {
          return caches.match("index.html");
        }
        throw err;
      });
    })
  );
});
