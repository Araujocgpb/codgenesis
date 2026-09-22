// Lógica da tela de lista de aulas (aulas.html)

document.addEventListener("DOMContentLoaded", () => {
  renderizarListaAulas();
});

function renderizarListaAulas() {
  const urlParams = new URLSearchParams(window.location.search);
  const trilhaId = urlParams.get("trilha");
  
  const container = document.getElementById("aulas-container");
  const tituloEl = document.getElementById("trilha-titulo");
  const breadcrumbEl = document.getElementById("trilha-breadcrumb");
  
  if (!container || !tituloEl) return;

  if (!trilhaId) {
    container.innerHTML = `<div class="quiz-feedback error">Erro: Nenhuma trilha selecionada.</div>`;
    return;
  }

  // Buscar trilha nos dados estáticos
  const trilha = TRILHAS_DATA.find(t => t.id === trilhaId);
  if (!trilha) {
    container.innerHTML = `<div class="quiz-feedback error">Erro: Trilha não encontrada.</div>`;
    return;
  }

  // Definir títulos da página
  tituloEl.textContent = trilha.titulo;
  breadcrumbEl.textContent = `Trilha • ${trilha.titulo}`;

  // Obter progresso atual do usuário
  const progresso = obterProgressoLocal();
  const user = getCurrentUser();
  const userId = user ? user.id : null;

  // Filtrar progresso deste usuário
  const aulasConcluidasIds = progresso
    .filter(p => p.usuario_id === userId && p.concluida)
    .map(p => p.aula_id);

  // Calcular progresso da trilha
  const totalAulas = trilha.aulas.length;
  const concluidasCount = trilha.aulas.filter(aula => aulasConcluidasIds.includes(aula.id)).length;
  const percent = totalAulas > 0 ? Math.round((concluidasCount / totalAulas) * 100) : 0;

  // Atualizar Barra de Progresso
  const progressoPercentEl = document.getElementById("trilha-progresso-percent");
  const progressoBarEl = document.getElementById("trilha-progresso-bar");
  
  if (progressoPercentEl && progressoBarEl) {
    progressoPercentEl.textContent = `${percent}%`;
    progressoBarEl.style.width = `${percent}%`;
  }

  // Renderizar a lista de aulas
  let html = "";
  trilha.aulas.forEach((aula, idx) => {
    const concluida = aulasConcluidasIds.includes(aula.id);
    const numeroFormatado = String(idx + 1).padStart(2, '0');
    
    html += `
      <a href="aula.html?trilha=${trilhaId}&aula=${aula.id}" class="aula-item">
        <div class="aula-info">
          <span class="aula-numero">Aula ${numeroFormatado}</span>
          <span class="aula-titulo">${aula.titulo}</span>
        </div>
        <div>
          ${concluida 
            ? '<span class="aula-status-badge status-concluida">Concluída</span>' 
            : '<span class="aula-status-badge status-pendente">Disponível</span>'}
        </div>
      </a>
    `;
  });

  container.innerHTML = html;
}
