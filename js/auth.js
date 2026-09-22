// Lógica de autenticação e gerenciamento de sessão (Online + Offline)

// Chave do localStorage para a sessão do usuário
const USER_SESSION_KEY = "codgenesis_user";

// Obter o usuário atualmente logado (do localStorage para permitir uso offline)
function getCurrentUser() {
  const userJson = localStorage.getItem(USER_SESSION_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }

}

// Salvar a sessão do usuário localmente
function saveUserSession(userData) {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userData));
}

function roleHome(user) {
  if (user && user.papel === "dono") return "owner.html";
  if (user && user.papel === "professor") return "professor.html";
  if (user && user.papel === "gestor_escola") return "owner.html";
  return "trilhas.html";
}

function requireRole(roles) {
  const user = getCurrentUser();
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!user || !allowed.includes(user.papel) || (user.papel !== "aluno" && user.autorizado !== true)) {
    window.location.href = user ? roleHome(user) : "login.html";
    return false;
  }
  return true;
}

async function refreshUserSession() {
  const user = getCurrentUser();
  if (!user || !window.supabaseClient || !navigator.onLine || !user.id) return user;
  const { data, error } = await window.supabaseClient.from("usuarios").select("*").eq("id", user.id).maybeSingle();
  if (!error && data) {
    const updated = { ...user, ...data, autorizado: data.autorizado === true };
    saveUserSession(updated);
    return updated;
  }

  return user;
}

async function requestPasswordReset(email) {
  if (!email) throw new Error("Informe seu e-mail.");
  if (!window.supabaseClient || !navigator.onLine) throw new Error("A recuperação de senha precisa de conexão com a internet.");
  const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}perfil.html`
  });
  if (error) throw error;
  return { success: true };
}

async function updateProfile({ nome, escola }) {
  const user = getCurrentUser();
  if (!user) throw new Error("Faça login para editar o perfil.");
  const values = { nome: String(nome || "").trim(), escola: String(escola || "").trim() || "Não informada" };
  if (!values.nome) throw new Error("Informe seu nome.");
  if (window.supabaseClient && navigator.onLine && user.id) {
    const { data, error } = await window.supabaseClient.from("usuarios").update(values).eq("id", user.id).select().single();
    if (error) throw error;
    saveUserSession({ ...user, ...data });
  } else {
    saveUserSession({ ...user, ...values });
    const users = JSON.parse(localStorage.getItem("codgenesis_local_users") || "[]");
    const index = users.findIndex(item => item.id === user.id);
    if (index >= 0) { users[index] = { ...users[index], ...values }; localStorage.setItem("codgenesis_local_users", JSON.stringify(users)); }
  }
  return getCurrentUser();
}

// Limpar a sessão local e fazer logout
async function logout() {
  localStorage.removeItem(USER_SESSION_KEY);
  
  if (window.supabaseClient && navigator.onLine) {
    try {
      await window.supabaseClient.auth.signOut();
    } catch (e) {
      console.warn("Falha ao deslogar no Supabase (ignorada offline):", e);
    }
  }
  
  window.location.href = "index.html";
}

// Verificar se o usuário está logado nas páginas protegidas
function checkAuth() {
  const user = getCurrentUser();
  const currentPath = window.location.pathname;
  const isAuthPage = currentPath.includes("login.html") || 
                     currentPath.includes("cadastro.html") || 
                     currentPath.includes("index.html") ||
                     currentPath.endsWith("/") ||
                     currentPath.endsWith("codgenesis"); // Tratar rotas vazias

  if (!user && !isAuthPage) {
    // Redireciona para o login se não estiver logado e tentar acessar conteúdo protegido
    window.location.href = "login.html";
  } else if (user && isAuthPage && !currentPath.includes("index.html")) {
    // Se já estiver logado e acessar login/cadastro, manda direto para as trilhas
    window.location.href = "trilhas.html";
  }
}

function exigirProfessor() {
  const user = getCurrentUser();
  if (!user || user.papel !== "professor" || user.autorizado !== true) {
    window.location.href = "trilhas.html";
    return false;
  }
  return true;
}

// Executar verificação de autenticação imediatamente
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  updateAuthUI();
  refreshUserSession().then(updateAuthUI).catch(() => {});
});

// Atualiza a interface (nomes, botões de login/logout)
function updateAuthUI() {
  const user = getCurrentUser();
  
  // Elementos comuns a várias páginas
  const userNameEl = document.getElementById("user-name-display");
  const logoutBtn = document.getElementById("logout-btn");
  
  if (userNameEl && user) {
    userNameEl.textContent = user.nome || user.email;
  }

  const roleLink = document.getElementById("role-dashboard-link");
  if (roleLink && user) {
    roleLink.href = roleHome(user);
    roleLink.textContent = user.papel === "professor" ? "Área do professor" : "Painel administrativo";
    roleLink.hidden = !["professor", "dono", "gestor_escola"].includes(user.papel);
  }
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
}

// Lógica de Login
async function loginUser(email, password, papelSolicitado = "aluno") {
  if (!email || !password) {
    throw new Error("Por favor, preencha todos os campos.");
  }

  const papelRequest = String(papelSolicitado || "aluno").trim().toLowerCase();

  // Se o Supabase estiver configurado e o usuário estiver online
  if (window.supabaseClient && navigator.onLine) {
    try {
      const { data: authData, error: authError } = await window.supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // Buscar os dados complementares da tabela usuarios
      const { data: userData, error: userError } = await window.supabaseClient
        .from('usuarios')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      if (papelRequest !== (userData.papel || "aluno")) {
        await window.supabaseClient.auth.signOut();
        throw new Error("O tipo de conta escolhido nao corresponde ao seu cadastro.");
      }
      if ((userData.papel === "professor" || userData.papel === "gestor_escola") && userData.autorizado !== true) {
        await window.supabaseClient.auth.signOut();
        throw new Error("Este acesso ainda aguarda autorizacao do dono do app.");
      }

      saveUserSession({
        id: authData.user.id,
        nome: userData.nome,
        email: userData.email,
        escola: userData.escola,
        papel: userData.papel || "aluno",
        autorizado: userData.autorizado === true,
        escola_id: userData.escola_id
      });

      return { success: true };
    } catch (error) {
      console.error("Erro no login Supabase:", error);
      throw new Error(error.message || "Erro ao fazer login no servidor.");
    }
  } else {
    // Se estiver offline ou sem Supabase, verifica se temos dados locais correspondentes de cadastro
    console.warn("Autenticação local/offline simulada.");

    const localUsers = JSON.parse(localStorage.getItem("codgenesis_local_users") || "[]");
    const foundUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      const userRole = String(foundUser.papel || "aluno").trim().toLowerCase();
      if (userRole !== papelRequest) {
        throw new Error("O tipo de conta escolhido nao corresponde ao seu cadastro.");
      }
      if (userRole !== "aluno" && foundUser.autorizado !== true) {
        throw new Error("Esta conta privilegiada precisa ser aprovada enquanto estiver online.");
      }

      saveUserSession(foundUser);
      return { success: true, mode: "offline-cache" };
    }

    if (papelRequest !== "aluno") {
      throw new Error("Contas de professor, gestor e dono precisam ser validadas online.");
    }

    const mockUser = {
      id: "offline-user-id-" + Date.now(),
      nome: email.split("@")[0],
      email: email,
      escola: "Escola Local Offline",
      papel: papelRequest,
      autorizado: false
    };

    localUsers.push(mockUser);
    localStorage.setItem("codgenesis_local_users", JSON.stringify(localUsers));

    saveUserSession(mockUser);
    return { success: true, mode: "offline-mock" };
  }
}

// Lógica de Cadastro
async function registerUser(nome, email, password, escola, papel = "aluno") {
  if (!nome || !email || !password) {
    throw new Error("Por favor, preencha todos os campos obrigatórios.");
  }

  const papelNormalizado = ["aluno", "professor", "gestor_escola", "dono"].includes(String(papel || "aluno").trim().toLowerCase())
    ? String(papel).trim().toLowerCase()
    : "aluno";

  const localUser = {
    id: window.supabaseClient && navigator.onLine ? null : "offline-user-id-" + Date.now(),
    nome,
    email,
    escola: escola || "Não informada",
    papel: papelNormalizado,
    autorizado: papelNormalizado !== "aluno"
  };

  // Se o Supabase estiver configurado e online
  if (window.supabaseClient && navigator.onLine) {
    try {
      const { data: authData, error: authError } = await window.supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { nome, escola: escola || "Não informada" } }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Erro ao criar cadastro.");

      localUser.id = authData.user.id;

      const { error: dbError } = await window.supabaseClient
        .from('usuarios')
        .upsert([
          { id: localUser.id, nome: localUser.nome, email: localUser.email, escola: localUser.escola, papel: localUser.papel, autorizado: false }
        ], { onConflict: 'id' });

      if (dbError) throw dbError;

      // Salva sessão localmente e redireciona
      saveUserSession(localUser);
      return { success: true };
    } catch (error) {
      console.error("Erro no cadastro Supabase:", error);
      throw new Error(error.message || "Erro ao cadastrar no servidor.");
    }
  } else {
    console.warn("Salvando cadastro offline no localStorage.");
    const localUsers = JSON.parse(localStorage.getItem("codgenesis_local_users") || "[]");

    if (localUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Este e-mail já está cadastrado localmente.");
    }

    localUsers.push(localUser);
    localStorage.setItem("codgenesis_local_users", JSON.stringify(localUsers));

    saveUserSession(localUser);
    return { success: true, mode: "offline" };
  }
}
