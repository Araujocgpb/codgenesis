// Lógica de renderização da Tela de Trilhas (trilhas.html)

document.addEventListener("DOMContentLoaded", () => {
  renderizarTrilhas();
});

function renderizarTrilhas() {
  const container = document.getElementById("trilhas-container");
  if (!container) return;

  if (typeof TRILHAS_DATA === 'undefined' || TRILHAS_DATA.length === 0) {
    container.innerHTML = `
      <div class="quiz-feedback error">
        Erro: Não foi possível carregar as trilhas do conteúdo estático.
      </div>
    `;
    return;
  }

  let html = "";
  TRILHAS_DATA.forEach(trilha => {
    html += `
      <a href="aulas.html?trilha=${trilha.id}" class="trilha-card">
        <div class="trilha-icon">${trilha.imagem || '📘'}</div>
        <h3 class="trilha-title">${trilha.titulo}</h3>
        <p class="trilha-desc">${trilha.descricao}</p>
        <span class="trilha-action">Acessar trilha</span>
      </a>
    `;
  });

  container.innerHTML = html;
}
