// Configurações do Supabase - Substitua pelas suas chaves públicas
const CONFIG = {
  SUPABASE_URL: "https://pkgmtiqostdegsfvkjqz.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_n4lG5EjP6A4J5sZQSNWaSg_BkQCdo8_"
};

// Tornar disponível globalmente se rodando no navegador
if (typeof window !== 'undefined') {
  window.CONFIG = CONFIG;
}
