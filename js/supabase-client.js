// Inicialização do cliente Supabase a partir das configurações públicas
let supabaseClient = null;

function initSupabase() {
  if (typeof supabase === 'undefined') {
    console.warn("Supabase library not loaded yet (probably offline or CDN blocked). Running in local/offline mode.");
    return null;
  }

  const url = window.CONFIG?.SUPABASE_URL;
  const key = window.CONFIG?.SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project-id") || key.includes("your-anon-key-here")) {
    console.warn("Configurações do Supabase não fornecidas ou inválidas no js/config.js. Rodando apenas em modo local.");
    return null;
  }

  try {
    supabaseClient = supabase.createClient(url, key);
    console.log("Cliente Supabase inicializado com sucesso.");
  } catch (error) {
    console.error("Erro ao inicializar o Supabase:", error);
  }
}

// Inicializar na carga do arquivo
initSupabase();

// Tornar disponível globalmente
if (typeof window !== 'undefined') {
  window.supabaseClient = supabaseClient;
}
