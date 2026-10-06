// Service Worker do CodGenesis - Armazenamento offline (PWA)

const CACHE_NAME = "codgenesis-cache-v5";

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
  "assets/imagens/logo.svg"
];

// Evento de instalação - Carrega os arquivos no cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(ASSETS_TO_CACHE.map(async (asset) => {
        try {
          await cache.add(asset);
        } catch (error) {
          console.error(`Service Worker: Não foi possível armazenar ${asset}:`, error);
        }
      })))
      .then(() => self.skipWaiting())
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
  const requestUrl = new URL(event.request.url);

  if (
    event.request.method !== "GET" ||
    requestUrl.origin !== self.location.origin ||
    requestUrl.hostname.endsWith(".supabase.co")
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok && networkResponse.type === "basic") {
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;

        if (event.request.mode === "navigate") {
          const fallbackUrl = new URL(requestUrl.pathname, self.location.origin);
          const routeFile = fallbackUrl.pathname.endsWith("/")
            ? `${fallbackUrl.pathname}index.html`
            : `${fallbackUrl.pathname}.html`;
          const routeResponse = await cache.match(
            new URL(routeFile, self.location.origin).href
          );
          if (routeResponse) return routeResponse;

          const homeResponse = await cache.match(new URL("index.html", self.location.origin).href);
          if (homeResponse) return homeResponse;
        }

        console.warn("Falha de rede; não há cópia em cache:", event.request.url, error);
        return new Response("Você está offline e este conteúdo ainda não foi armazenado.", {
          status: 503,
          statusText: "Offline",
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })()
  );
});
