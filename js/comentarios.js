const COMMENTS_CACHE = "codgenesis_comentarios";
function commentText(value) { return String(value || "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
async function loadComments(aulaId) {
  const list = document.getElementById("comments-list"); if (!list) return;
  let comments = [];
  if (window.supabaseClient && navigator.onLine) {
    const result = await window.supabaseClient.from("comentarios").select("id,texto,criado_em,aluno_id,usuarios(nome)").eq("aula_id", aulaId).order("criado_em", { ascending: true });
    if (!result.error) comments = result.data || [];
  } else {
    comments = JSON.parse(localStorage.getItem(COMMENTS_CACHE) || "[]").filter(item => item.aula_id === aulaId);
  }
  list.innerHTML = comments.map(item => `<div class="task-item"><span><strong>${commentText(item.usuarios?.nome || "Usuário")}</strong><br>${commentText(item.texto)}</span><small>${new Date(item.criado_em).toLocaleDateString("pt-BR")}</small></div>`).join("") || "<p class='text-muted'>Seja o primeiro a comentar.</p>";
}
async function submitComment(aulaId, texto) {
  const user = getCurrentUser(); if (!user) throw new Error("Faça login para comentar.");
  const payload = { aula_id: aulaId, aluno_id: user.id, texto };
  if (window.supabaseClient && navigator.onLine) {
    const { error } = await window.supabaseClient.from("comentarios").insert(payload); if (error) throw error;
  } else {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_CACHE) || "[]"); comments.push({ ...payload, criado_em: new Date().toISOString(), usuarios: { nome: user.nome } }); localStorage.setItem(COMMENTS_CACHE, JSON.stringify(comments));
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const aulaId = Number(new URLSearchParams(window.location.search).get("aula")); if (!aulaId) return;
  loadComments(aulaId);
  document.getElementById("comment-form")?.addEventListener("submit", async event => {
    event.preventDefault(); const input = document.getElementById("comment-text");
    try { await submitComment(aulaId, input.value.trim()); input.value = ""; loadComments(aulaId); } catch (error) { alert(error.message); }
  });
});
