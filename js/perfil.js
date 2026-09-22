document.addEventListener("DOMContentLoaded", () => {
  const user = getCurrentUser(); if (!user) return;
  document.getElementById("profile-name").value = user.nome || "";
  document.getElementById("profile-school").value = user.escola || "";
  const feedback = (text, error) => { const el = document.getElementById("profile-feedback"); el.textContent = text; el.className = `quiz-feedback ${error ? "error" : "success"}`; el.style.display = "block"; };
  document.getElementById("profile-form").addEventListener("submit", async e => { e.preventDefault(); try { await updateProfile({ nome: document.getElementById("profile-name").value, escola: document.getElementById("profile-school").value }); feedback("Perfil atualizado."); } catch (error) { feedback(error.message, true); } });
  document.getElementById("reset-password").addEventListener("click", async () => { try { await requestPasswordReset(user.email); feedback("Link enviado. Verifique seu e-mail."); } catch (error) { feedback(error.message, true); } });
});
