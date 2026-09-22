// Lógica do quiz da aula (quiz.html)

let selectedOptionIdx = null;
let isAnswered = false;

document.addEventListener("DOMContentLoaded", () => {
  inicializarQuiz();
});

function inicializarQuiz() {
  const urlParams = new URLSearchParams(window.location.search);
  const trilhaId = urlParams.get("trilha");
  const aulaId = parseInt(urlParams.get("aula"));

  const aulaTituloEl = document.getElementById("aula-titulo-display");
  const questionEl = document.getElementById("quiz-question-text");
  const optionsContainer = document.getElementById("quiz-options-container");
  const btnResponder = document.getElementById("btn-responder");
  const backBtn = document.getElementById("back-to-aula-btn");

  if (!trilhaId || !aulaId) {
    if (questionEl) questionEl.innerHTML = `<div class="quiz-feedback error">Erro: Quiz não especificado.</div>`;
    return;
  }

  // Buscar trilha e aula nos dados locais
  const trilha = TRILHAS_DATA.find(t => t.id === trilhaId);
  const aula = trilha?.aulas.find(a => a.id === aulaId);

  if (!trilha || !aula || !aula.quiz) {
    if (questionEl) questionEl.innerHTML = `<div class="quiz-feedback error">Erro: Quiz não encontrado para esta aula.</div>`;
    return;
  }

  // Configurar botão de voltar para a aula
  if (backBtn) {
    backBtn.href = `aula.html?trilha=${trilhaId}&aula=${aulaId}`;
  }

  // Configurar textos
  if (aulaTituloEl) aulaTituloEl.textContent = aula.titulo;
  if (questionEl) questionEl.textContent = aula.quiz.pergunta;

  // Renderizar as opções
  if (optionsContainer) {
    optionsContainer.innerHTML = "";
    aula.quiz.alternativas.forEach((opcao, idx) => {
      const optionEl = document.createElement("div");
      optionEl.className = "quiz-option";
      optionEl.textContent = opcao;
      optionEl.dataset.index = idx;
      
      optionEl.addEventListener("click", () => {
        if (isAnswered) return;
        
        // Remover classe selecionada de todas as opções
        document.querySelectorAll(".quiz-option").forEach(opt => {
          opt.classList.remove("selected");
        });

        // Marcar a opção atual
        optionEl.classList.add("selected");
        selectedOptionIdx = idx;

        // Habilitar botão
        btnResponder.disabled = false;
        btnResponder.classList.remove("btn-disabled");
      });

      optionsContainer.appendChild(optionEl);
    });
  }

  // Configurar clique de resposta
  if (btnResponder) {
    btnResponder.addEventListener("click", () => {
      if (selectedOptionIdx === null || isAnswered) return;
      verificarResposta(trilhaId, aulaId, aula.quiz);
    });
  }
}

function verificarResposta(trilhaId, aulaId, quiz) {
  isAnswered = true;
  
  const options = document.querySelectorAll(".quiz-option");
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const btnResponder = document.getElementById("btn-responder");
  const btnProximo = document.getElementById("btn-proximo-fluxo");

  // Esconder botão responder
  if (btnResponder) btnResponder.style.display = "none";

  const acerto = selectedOptionIdx === quiz.resposta_correta;

  // Estilizar opções com cores de feedback
  options.forEach((opt, idx) => {
    opt.classList.remove("selected");
    if (idx === quiz.resposta_correta) {
      opt.classList.add("correct");
    } else if (idx === selectedOptionIdx && !acerto) {
      opt.classList.add("incorrect");
    }
  });

  // Mostrar caixa de feedback
  if (feedbackBox) {
    feedbackBox.style.display = "block";
    if (acerto) {
      feedbackBox.className = "quiz-feedback success";
      feedbackBox.innerHTML = "🎉 Resposta Correta! Parabéns!";
    } else {
      feedbackBox.className = "quiz-feedback error";
      feedbackBox.innerHTML = `❌ Resposta Incorreta! A opção certa era:<br><strong>${quiz.alternativas[quiz.resposta_correta]}</strong>`;
    }
  }

  // Salvar progresso de conclusão da aula (conclusão é registrada independente do acerto para fins pedagógicos de encorajamento)
  salvarProgressoLocal(aulaId);

  // Configurar botão de continuação
  if (btnProximo) {
    btnProximo.style.display = "flex";
    
    // Procurar se existe próxima aula
    const trilha = TRILHAS_DATA.find(t => t.id === trilhaId);
    const aulaIndex = trilha.aulas.findIndex(a => a.id === aulaId);
    const proximaAula = trilha.aulas[aulaIndex + 1];

    if (proximaAula) {
      btnProximo.href = `aula.html?trilha=${trilhaId}&aula=${proximaAula.id}`;
      btnProximo.textContent = "Ir para Próxima Aula";
      btnProximo.className = "btn btn-primary";
    } else {
      // Se for a última aula da trilha, redireciona para a lista ou progresso
      btnProximo.href = `progresso.html`;
      btnProximo.textContent = "Ver Meu Progresso";
      btnProximo.className = "btn btn-primary";
    }
  }
}
