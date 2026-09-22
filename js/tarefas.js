// Tarefas praticas independentes do progresso das aulas.

const TAREFAS_KEY = "codgenesis_tarefas";
const TAREFAS_DATA = [
  { id: "programacao-resumo", trilha: "programacao", texto: "Escreva um resumo de 3 linhas sobre o que e um algoritmo." },
  { id: "programacao-exemplo", trilha: "programacao", texto: "Crie um exemplo de variavel usando um nome e uma idade." },
  { id: "programacao-desafio", trilha: "programacao", texto: "Explique em voz alta uma decisao que um programa pode tomar." },
  { id: "robotica-observacao", trilha: "robotica", texto: "Encontre um sensor e um atuador em um objeto da sua casa." },
  { id: "robotica-esquema", trilha: "robotica", texto: "Desenhe um circuito simples com um LED e uma placa." },
  { id: "robotica-projeto", trilha: "robotica", texto: "Descreva uma automacao que voce gostaria de construir." },
  { id: "inclusao-pesquisa", trilha: "inclusao_digital", texto: "Compare duas fontes antes de compartilhar uma noticia." },
  { id: "inclusao-senha", trilha: "inclusao_digital", texto: "Revise uma senha importante e ative a verificacao em duas etapas." },
  { id: "inclusao-planilha", trilha: "inclusao_digital", texto: "Monte uma pequena tabela de gastos da semana." }
];

function obterTarefasLocais() {
  try { return JSON.parse(localStorage.getItem(TAREFAS_KEY) || "[]"); } catch (error) { return []; }
}

function salvarTarefasLocais(tarefas) {
  localStorage.setItem(TAREFAS_KEY, JSON.stringify(tarefas));
}

function renderizarTarefas() {
  const container = document.getElementById("tarefas-container");
  const contador = document.getElementById("tarefas-contador");
  const user = getCurrentUser();
  if (!container || !user) return;

  const registros = obterTarefasLocais();
  const tarefasDoUsuario = registros.filter(item => item.usuario_id === user.id && item.concluida);
  const concluidas = TAREFAS_DATA.filter(tarefa => tarefasDoUsuario.some(item => item.tarefa_id === tarefa.id)).length;
  if (contador) contador.textContent = `${concluidas}/${TAREFAS_DATA.length}`;

  container.innerHTML = TAREFAS_DATA.map(tarefa => {
    const done = tarefasDoUsuario.some(item => item.tarefa_id === tarefa.id);
    return `<label class="task-item${done ? " done" : ""}"><input type="checkbox" data-tarefa-id="${tarefa.id}" ${done ? "checked" : ""}><span class="task-label">${tarefa.texto}</span></label>`;
  }).join("");

  container.querySelectorAll("input[data-tarefa-id]").forEach(input => {
    input.addEventListener("change", () => alternarTarefa(input.dataset.tarefaId, input.checked));
  });
}

async function alternarTarefa(tarefaId, concluida) {
  const user = getCurrentUser();
  if (!user) return;
  const tarefas = obterTarefasLocais();
  const existente = tarefas.find(item => item.usuario_id === user.id && item.tarefa_id === tarefaId);
  if (existente) existente.concluida = concluida;
  else tarefas.push({ usuario_id: user.id, tarefa_id: tarefaId, concluida, sincronizado: false });
  salvarTarefasLocais(tarefas);
  renderizarTarefas();

  if (navigator.onLine && window.supabaseClient) {
    const { error } = await window.supabaseClient.from("tarefas").upsert({
      usuario_id: user.id, tarefa_id: tarefaId, concluida, atualizada_em: new Date().toISOString()
    }, { onConflict: "usuario_id,tarefa_id" });
    if (!error) {
      const registro = obterTarefasLocais().find(item => item.usuario_id === user.id && item.tarefa_id === tarefaId);
      if (registro) { registro.sincronizado = true; salvarTarefasLocais(obterTarefasLocais()); }
    }
  }
}

document.addEventListener("DOMContentLoaded", renderizarTarefas);