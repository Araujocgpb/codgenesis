// Lógica da tela de Progresso Global (progresso.html)

document.addEventListener("DOMContentLoaded", () => {
  renderizarProgresso();
});

function renderizarProgresso() {
  const container = document.getElementById("progresso-container-list");
  if (!container) return;

  if (typeof TRILHAS_DATA === 'undefined') {
    container.innerHTML = `<div class="quiz-feedback error">Erro: Conteúdos não carregados.</div>`;
    return;
  }

  const user = getCurrentUser();
  const userId = user ? user.id : null;
  const progresso = obterProgressoLocal();

  // Filtrar progresso concluído do usuário ativo
  const concluidasIds = progresso
    .filter(p => p.usuario_id === userId && p.concluida)
    .map(p => p.aula_id);

  let html = "";

  TRILHAS_DATA.forEach(trilha => {
    const totalAulas = trilha.aulas.length;
    const concluidasCount = trilha.aulas.filter(aula => concluidasIds.includes(aula.id)).length;
    const percent = totalAulas > 0 ? Math.round((concluidasCount / totalAulas) * 100) : 0;

    // Gerar barra em caracteres conforme especificado no mockup do MVP (ex: ████████░░ 80%)
    const totalBlocos = 10;
    const blocosAtivos = Math.round(percent / 10);
    const barraTexto = "█".repeat(blocosAtivos) + "░".repeat(totalBlocos - blocosAtivos);

    html += `
      <div class="progresso-trilha-row">
        <div class="progresso-trilha-header">
          <span>${trilha.titulo}</span>
          <span style="color: var(--primary);">${concluidasCount} / ${totalAulas} Aulas</span>
        </div>
        
        <!-- Barra em caracteres do mockup -->
        <div style="font-family: monospace; font-size: 1.25rem; color: var(--primary); letter-spacing: 2px; margin: 12px 0 6px 0; line-height: 1;">
          ${barraTexto} <span style="font-size: 0.95rem; font-weight: 700; font-family: var(--font-family-body);">${percent}%</span>
        </div>
        
        <!-- Barra gráfica complementar premium -->
        <div class="progress-container" style="height: 6px; margin: 8px 0 0 0;">
          <div class="progress-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Expor globalmente para atualização em tempo real na sincronização
if (typeof window !== 'undefined') {
  window.renderizarProgresso = renderizarProgresso;
}
