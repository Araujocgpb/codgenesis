// Gerenciador de conectividade e sincronização offline de progresso

const PROGRESSO_KEY = "codgenesis_progresso";

// Obtém o progresso total armazenado localmente
function obterProgressoLocal() {
  const data = localStorage.getItem(PROGRESSO_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Salva o progresso localmente
function salvarProgressoLocal(aulaId) {
  const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(localStorage.getItem("codgenesis_user") || "null");
  if (!user) return;

  let progresso = obterProgressoLocal();
  
  // Procura se já existe registro dessa aula para este usuário
  const index = progresso.findIndex(p => p.usuario_id === user.id && p.aula_id === aulaId);
  
  const novoRegistro = {
    usuario_id: user.id,
    aula_id: aulaId,
    concluida: true,
    data_conclusao: new Date().toISOString(),
    sincronizado: false // Inicialmente não sincronizado
  };

  if (index >= 0) {
    // Apenas atualiza se não estava concluído
    progresso[index] = { ...progresso[index], ...novoRegistro, sincronizado: progresso[index].sincronizado };
  } else {
    progresso.push(novoRegistro);
  }

  localStorage.setItem(PROGRESSO_KEY, JSON.stringify(progresso));
  console.log(`Aula ${aulaId} salva localmente.`);

  // Disparar sincronização se estiver online
  if (navigator.onLine) {
    sincronizarProgressoComServidor();
  }
}

// Sincroniza progresso pendente para o Supabase
async function sincronizarProgressoComServidor() {
  if (!navigator.onLine || !window.supabaseClient) {
    console.log("Sincronização ignorada: offline ou Supabase não configurado.");
    return;
  }

  const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(localStorage.getItem("codgenesis_user") || "null");
  if (!user) return;

  let progresso = obterProgressoLocal();
  const pendentes = progresso.filter(p => p.usuario_id === user.id && !p.sincronizado);

  if (pendentes.length === 0) {
    console.log("Nenhum progresso pendente para sincronizar.");
    return;
  }

  console.log(`Sincronizando ${pendentes.length} registros com o Supabase...`);
  
  let sucessoSinc = false;

  for (const item of pendentes) {
    try {
      // Upsert no banco de dados do Supabase
      const { error } = await window.supabaseClient
        .from('progresso')
        .upsert({
          usuario_id: item.usuario_id,
          aula_id: item.aula_id,
          concluida: true,
          data_conclusao: item.data_conclusao
        }, { onConflict: 'usuario_id,aula_id' });

      if (error) throw error;

      // Marcar item específico como sincronizado
      item.sincronizado = true;
      sucessoSinc = true;
    } catch (err) {
      console.error(`Erro ao sincronizar aula ${item.aula_id}:`, err);
    }
  }

  if (sucessoSinc) {
    localStorage.setItem(PROGRESSO_KEY, JSON.stringify(progresso));
    console.log("Sincronização parcial/completa concluída com sucesso.");
    
    // Atualizar UI de progresso se houver na tela
    if (window.renderizarProgresso) {
      window.renderizarProgresso();
    }
  }
}

// Atualiza o banner indicador de conexão nas páginas
function atualizarIndicadorConexao() {
  let statusBar = document.getElementById("status-bar");
  
  // Se não existir o container da barra de status, cria dinamicamente no início do body
  if (!statusBar) {
    statusBar = document.createElement("div");
    statusBar.id = "status-bar";
    statusBar.className = "status-bar";
    document.body.insertBefore(statusBar, document.body.firstChild);
  }

  if (navigator.onLine) {
    statusBar.className = "status-bar online";
    statusBar.innerHTML = '<span class="icon"></span> ONLINE — Sincronização disponível';
    
    // Sincronizar dados pendentes ao retornar para online
    sincronizarProgressoComServidor();
  } else {
    statusBar.className = "status-bar offline";
    statusBar.innerHTML = '<span class="icon"></span> OFFLINE — Você pode continuar estudando. Progresso salvo localmente.';
  }
}

// Escutar eventos de conectividade do navegador
window.addEventListener("online", () => {
  atualizarIndicadorConexao();
});

window.addEventListener("offline", () => {
  atualizarIndicadorConexao();
});

// Inicializar na carga da página
document.addEventListener("DOMContentLoaded", () => {
  atualizarIndicadorConexao();
  
  // Tentar baixar o progresso do servidor se estiver online para atualizar o localStorage
  if (navigator.onLine && window.supabaseClient) {
    baixarProgressoDoServidor();
  }
});

// Baixa o progresso do servidor para sincronizar o estado local
async function baixarProgressoDoServidor() {
  const user = window.getCurrentUser ? window.getCurrentUser() : JSON.parse(localStorage.getItem("codgenesis_user") || "null");
  if (!user || !window.supabaseClient) return;

  try {
    const { data, error } = await window.supabaseClient
      .from('progresso')
      .select('aula_id, concluida, data_conclusao')
      .eq('usuario_id', user.id);

    if (error) throw error;

    if (data && data.length > 0) {
      let progressoLocal = obterProgressoLocal();

      data.forEach(serv => {
        // Encontra ou adiciona
        const idx = progressoLocal.findIndex(p => p.usuario_id === user.id && p.aula_id === serv.aula_id);
        if (idx >= 0) {
          progressoLocal[idx].sincronizado = true;
          progressoLocal[idx].concluida = serv.concluida;
        } else {
          progressoLocal.push({
            usuario_id: user.id,
            aula_id: serv.aula_id,
            concluida: serv.concluida,
            data_conclusao: serv.data_conclusao,
            sincronizado: true
          });
        }
      });

      localStorage.setItem(PROGRESSO_KEY, JSON.stringify(progressoLocal));
      
      // Atualiza progresso da tela se necessário
      if (window.renderizarProgresso) {
        window.renderizarProgresso();
      }
    }
  } catch (err) {
    console.warn("Não foi possível puxar progresso do servidor (talvez tabela inexistente ou RLS):", err);
  }
}
