const PROFESSOR_CACHE = "codgenesis_conteudo_customizado";
function professorFeedback(text, error) {
  const el = document.getElementById("prof-feedback");
  if (el) { el.textContent = text; el.className = `quiz-feedback ${error ? "error" : "success"}`; el.style.display = "block"; }
}
async function saveCustomContent(type, values) {
  const user = getCurrentUser();
  if (!user || !requireRole("professor")) return;
  const table = type === "lesson" ? "aulas_customizadas" : "tarefas_customizadas";
  const payload = type === "lesson"
    ? { professor_id: user.id, trilha_id: values.track, titulo: values.title, conteudo: values.content }
    : { professor_id: user.id, trilha_id: values.track, texto: values.text };
  if (window.supabaseClient && navigator.onLine) {
    const { error } = await window.supabaseClient.from(table).insert(payload);
    if (error) throw error;
  } else {
    const cached = JSON.parse(localStorage.getItem(PROFESSOR_CACHE) || "[]");
    cached.push({ ...payload, type, id: `offline-${Date.now()}`, criada_em: new Date().toISOString() });
    localStorage.setItem(PROFESSOR_CACHE, JSON.stringify(cached));
  }
}
async function loadCustomContent() {
  if (!requireRole("professor")) return;
  const user = getCurrentUser(), list = document.getElementById("custom-list");
  let rows = JSON.parse(localStorage.getItem(PROFESSOR_CACHE) || "[]").filter(item => item.professor_id === user.id);
  if (window.supabaseClient && navigator.onLine) {
    const pending = rows.filter(item => item.professor_id === user.id);
    for (const item of pending) {
      const table = item.type === "lesson" ? "aulas_customizadas" : "tarefas_customizadas";
      const { id, type, ...payload } = item;
      const result = await window.supabaseClient.from(table).insert(payload);
      if (!result.error) rows = rows.filter(current => current.id !== id);
    }
    localStorage.setItem(PROFESSOR_CACHE, JSON.stringify(rows));
    const [lessons, tasks] = await Promise.all([
      window.supabaseClient.from("aulas_customizadas").select("titulo,trilha_id,criada_em").eq("professor_id", user.id),
      window.supabaseClient.from("tarefas_customizadas").select("texto,trilha_id,criada_em").eq("professor_id", user.id)
    ]);
    rows = [...(lessons.data || []).map(item => ({ ...item, type: "Aula" })), ...(tasks.data || []).map(item => ({ ...item, type: "Tarefa" }))];
  }
  list.innerHTML = rows.map(item => `<div class="task-item"><span><strong>${item.type}</strong> · ${item.titulo || item.texto}</span><small>${item.trilha_id}</small></div>`).join("") || "<p class='text-muted'>Você ainda não publicou conteúdo.</p>";
}
document.addEventListener("DOMContentLoaded", () => {
  loadCustomContent();
  document.getElementById("lesson-form")?.addEventListener("submit", async e => {
    e.preventDefault();
    try { await saveCustomContent("lesson", { title: document.getElementById("lesson-title").value.trim(), track: document.getElementById("lesson-track").value.trim(), content: document.getElementById("lesson-content").value.trim() }); e.target.reset(); professorFeedback("Aula publicada."); loadCustomContent(); } catch (error) { professorFeedback(error.message, true); }
  });
  document.getElementById("task-form")?.addEventListener("submit", async e => {
    e.preventDefault();
    try { await saveCustomContent("task", { text: document.getElementById("task-text").value.trim(), track: document.getElementById("task-track").value.trim() }); e.target.reset(); professorFeedback("Tarefa publicada."); loadCustomContent(); } catch (error) { professorFeedback(error.message, true); }
  });
});
