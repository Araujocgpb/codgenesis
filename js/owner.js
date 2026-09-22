function adminMessage(text, error) {
  const el = document.getElementById("admin-feedback");
  if (el) { el.textContent = text; el.className = `quiz-feedback ${error ? "error" : "success"}`; el.style.display = "block"; }
}
function safeText(value) { return String(value || "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c])); }
async function loadAdminData() {
  if (!requireRole(["dono", "gestor_escola"])) return;
  const usersEl = document.getElementById("users-list"), schoolsEl = document.getElementById("schools-list");
  if (!window.supabaseClient || !navigator.onLine) {
    const users = JSON.parse(localStorage.getItem("codgenesis_local_users") || "[]");
    usersEl.innerHTML = users.map(u => `<div class="task-item"><span>${safeText(u.nome)} (${safeText(u.papel)})</span><strong>${u.autorizado ? "Aprovado" : "Offline"}</strong></div>`).join("") || "<p class='text-muted'>Nenhum usuário local.</p>";
    schoolsEl.innerHTML = "<p class='text-muted'>Escolas ficam disponíveis quando o Supabase estiver conectado.</p>"; return;
  }
  const [{ data: users, error: usersError }, { data: schools, error: schoolsError }] = await Promise.all([
    window.supabaseClient.from("usuarios").select("id,nome,email,papel,autorizado,escola").order("criado_em", { ascending: false }),
    window.supabaseClient.from("escolas").select("id,nome,criada_em").order("nome")
  ]);
  if (usersError) { adminMessage(usersError.message, true); return; }
  usersEl.innerHTML = (users || []).map(u => `<div class="task-item"><span><strong>${safeText(u.nome)}</strong><br><small>${safeText(u.email)} · ${safeText(u.papel)} · ${safeText(u.escola)}</small></span>${u.autorizado ? "<span class='text-muted'>Aprovado</span>" : `<button class="btn btn-primary approve-user" data-id="${u.id}">Aprovar</button>`}</div>`).join("") || "<p class='text-muted'>Nenhum usuário.</p>";
  (users || []).filter(u => !u.autorizado).forEach(u => document.querySelector(`.approve-user[data-id="${u.id}"]`)?.addEventListener("click", () => approveUser(u.id)));
  if (schoolsError) { schoolsEl.innerHTML = `<p class="text-muted">${safeText(schoolsError.message)}</p>`; return; }
  schoolsEl.innerHTML = (schools || []).map(s => `<div class="task-item">${safeText(s.nome)}</div>`).join("") || "<p class='text-muted'>Nenhuma escola.</p>";
}
async function approveUser(id) {
  const { error } = await window.supabaseClient.from("usuarios").update({ autorizado: true }).eq("id", id);
  if (error) adminMessage(error.message, true); else { adminMessage("Usuário aprovado."); loadAdminData(); }
}
document.addEventListener("DOMContentLoaded", () => {
  loadAdminData(); document.getElementById("refresh-users")?.addEventListener("click", loadAdminData);
  document.getElementById("school-form")?.addEventListener("submit", async e => {
    e.preventDefault(); const nome = document.getElementById("school-name").value.trim(); const user = getCurrentUser();
    if (!window.supabaseClient || !navigator.onLine) { adminMessage("Escola salva apenas no modo online.", true); return; }
    const { error } = await window.supabaseClient.from("escolas").insert({ nome, criada_por: user.id });
    if (error) adminMessage(error.message, true); else { e.target.reset(); loadAdminData(); }
  });
});
