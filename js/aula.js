// Lógica da tela de detalhes da aula (aula.html)

document.addEventListener("DOMContentLoaded", () => {
  inicializarAula();
});

function inicializarAula() {
  const urlParams = new URLSearchParams(window.location.search);
  const trilhaId = urlParams.get("trilha");
  const aulaId = parseInt(urlParams.get("aula"));

  const tituloEl = document.getElementById("aula-titulo");
  const metaEl = document.getElementById("aula-trilha-meta");
  const conteudoEl = document.getElementById("aula-conteudo");
  const backBtn = document.getElementById("back-btn");
  const btnConcluir = document.getElementById("btn-concluir");
  const btnProxima = document.getElementById("btn-proxima");

  if (!trilhaId || !aulaId) {
    if (conteudoEl) conteudoEl.innerHTML = `<div class="quiz-feedback error">Erro: Aula não especificada.</div>`;
    return;
  }

  // Buscar trilha
  const trilha = TRILHAS_DATA.find(t => t.id === trilhaId);
  if (!trilha) {
    if (conteudoEl) conteudoEl.innerHTML = `<div class="quiz-feedback error">Erro: Trilha não encontrada.</div>`;
    return;
  }

  // Buscar aula específica
  const aulaIndex = trilha.aulas.findIndex(a => a.id === aulaId);
  if (aulaIndex === -1) {
    if (conteudoEl) conteudoEl.innerHTML = `<div class="quiz-feedback error">Erro: Aula não encontrada.</div>`;
    return;
  }

  const aula = trilha.aulas[aulaIndex];

  // Configurar botão de voltar
  if (backBtn) {
    backBtn.href = `aulas.html?trilha=${trilhaId}`;
  }

  // Preencher textos na tela
  if (metaEl) metaEl.textContent = trilha.titulo;
  if (tituloEl) tituloEl.textContent = aula.titulo;
  if (conteudoEl) conteudoEl.innerHTML = aula.conteudo;

  // Verificar se a aula já foi concluída pelo usuário
  const progresso = obterProgressoLocal();
  const user = getCurrentUser();
  const userId = user ? user.id : null;
  const jaConcluida = progresso.some(p => p.usuario_id === userId && p.aula_id === aulaId && p.concluida);

  if (btnConcluir) {
    btnConcluir.href = `quiz.html?trilha=${trilhaId}&aula=${aulaId}`;
    if (jaConcluida) {
      btnConcluir.textContent = "Refazer Quiz desta Aula";
      btnConcluir.className = "btn btn-outline"; // Visual secundário se já fez
    } else {
      btnConcluir.textContent = "Fazer Quiz e Concluir Aula";
      btnConcluir.className = "btn btn-primary";
    }
  }

  // Configurar Próxima Aula
  const proximaAula = trilha.aulas[aulaIndex + 1];
  if (btnProxima) {
    if (proximaAula) {
      btnProxima.href = `aula.html?trilha=${trilhaId}&aula=${proximaAula.id}`;
      btnProxima.classList.remove("btn-disabled");
      btnProxima.textContent = "Próxima Aula";
    } else {
      btnProxima.removeAttribute("href");
      btnProxima.classList.add("btn-disabled");
      btnProxima.textContent = "Fim da Trilha";
    }
  }
}
