// Dados estáticos de trilhas, aulas e quizzes para funcionamento offline
const TRILHAS_DATA = [
  {
    id: "programacao",
    titulo: "Programação",
    descricao: "Aprenda os fundamentos da programação e da lógica para criar seus próprios programas e soluções digitais.",
    imagem: "💻",
    aulas: [
      {
        id: 101,
        ordem: 1,
        titulo: "Introdução à Programação",
        conteudo: `<h3>O que é Programação?</h3>
<p>Programação é o processo de escrever instruções para um computador executar. Assim como usamos o português para nos comunicarmos com outras pessoas, usamos linguagens de programação (como JavaScript, Python ou C++) para conversar com o computador.</p>
<p>Computadores são máquinas muito rápidas, mas eles não sabem o que fazer sozinhos. Eles precisam de instruções extremamente precisas para realizar qualquer tarefa, desde somar dois números até enviar um foguete para o espaço.</p>
<h3>Por que aprender a programar?</h3>
<ul>
  <li>Desenvolve o raciocínio lógico e a resolução de problemas.</li>
  <li>Permite criar sites, aplicativos, jogos e automatizar tarefas.</li>
  <li>Abre portas para diversas profissões de alta demanda no mercado atual.</li>
</ul>
<p>Nesta trilha, você aprenderá as bases que servem para qualquer linguagem de programação. Vamos começar!</p>`,
        quiz: {
          id: 201,
          pergunta: "O que é programar no contexto da tecnologia?",
          alternativas: [
            "Trocar componentes físicos de um computador como memória ou tela.",
            "Escrever instruções precisas para que um computador execute tarefas.",
            "Apenas acessar redes sociais e navegar na internet.",
            "Desenhar imagens e criar vídeos usando ferramentas digitais."
          ],
          resposta_correta: 1
        }
      },
      {
        id: 102,
        ordem: 2,
        titulo: "Lógica de Programação",
        conteudo: `<h3>Entendendo a Lógica</h3>
<p>Lógica de programação é a organização coerente de ideias e instruções para atingir um objetivo específico. Pensar logicamente significa entender que, para resolver um problema maior, precisamos dividi-lo em etapas ordenadas e sem ambiguidades.</p>
<p>Por exemplo, se você quer ensinar alguém a fazer um sanduíche de presunto, a sequência lógica correta é:</p>
<ol>
  <li>Pegar duas fatias de pão.</li>
  <li>Colocar a fatia de presunto sobre uma das fatias de pão.</li>
  <li>Colocar a outra fatia de pão por cima.</li>
</ol>
<p>Se invertermos as ordens (como colocar o presunto antes de pegar o pão), a receita não funcionará. Na programação é a mesma coisa: o computador executa o código linha por linha, de cima para baixo. A ordem faz toda a diferença.</p>`,
        quiz: {
          id: 202,
          pergunta: "Por que a ordem das instruções é importante na lógica de programação?",
          alternativas: [
            "Porque o computador executa as instruções de forma aleatória.",
            "Porque linguagens diferentes rodam o código de baixo para cima.",
            "Porque o computador executa o código linha por linha, de cima para baixo, exigindo uma sequência correta.",
            "A ordem não importa, o computador sempre descobre o que você queria fazer."
          ],
          resposta_correta: 2
        }
      },
      {
        id: 103,
        ordem: 3,
        titulo: "Algoritmos",
        conteudo: `<h3>O que é um Algoritmo?</h3>
<p>Um algoritmo é uma sequência passo a passo de instruções bem definidas e finitas para realizar uma tarefa ou resolver um problema específico.</p>
<p>Podemos pensar em receitas de bolo, manuais de montagem de móveis e até mesmo rotinas matinais como algoritmos do dia a dia. Todos eles têm uma entrada (ingredientes/peças), um processamento (instruções a seguir) e uma saída (o bolo pronto/móvel montado).</p>
<p>Em computação, algoritmos realizam tarefas como buscar um vídeo no YouTube, ordenar uma lista de nomes em ordem alfabética ou calcular a rota mais rápida no GPS.</p>`,
        quiz: {
          id: 203,
          pergunta: "O que é um algoritmo?",
          alternativas: [
            "Um tipo físico de computador superpotente.",
            "Uma sequência passo a passo de instruções para resolver um problema.",
            "Um sistema operacional usado em celulares.",
            "Um banco de dados onde guardamos fotos e contatos."
          ],
          resposta_correta: 1
        }
      },
      {
        id: 104,
        ordem: 4,
        titulo: "Variáveis",
        conteudo: `<h3>Guardando Informações</h3>
<p>Durante a execução de um programa, precisamos armazenar dados temporariamente. Para isso, utilizamos as <strong>Variáveis</strong>.</p>
<p>Imagine uma variável como uma caixa organizadora dentro da memória do computador. Cada caixa possui uma etiqueta (nome da variável) e um conteúdo (o valor guardado dentro dela).</p>
<p>Podemos criar variáveis para salvar informações como:</p>
<ul>
  <li>O nome do usuário: <code>nome = "Carlos"</code> (Tipo Texto)</li>
  <li>A idade dele: <code>idade = 15</code> (Tipo Número Inteiro)</li>
  <li>Se ele concluiu a aula: <code>concluida = true</code> (Tipo Lógico - Verdadeiro/Falso)</li>
</ul>
<p>Podemos alterar o valor dentro dessa caixa a qualquer momento no nosso código.</p>`,
        quiz: {
          id: 204,
          pergunta: "Na programação, qual a função de uma variável?",
          alternativas: [
            "Apagar o código digitado incorretamente.",
            "Visualizar os erros e avisos da aplicação.",
            "Armazenar e representar dados temporários na memória do computador.",
            "Medir a velocidade da conexão de internet do usuário."
          ],
          resposta_correta: 2
        }
      },
      {
        id: 105,
        ordem: 5,
        titulo: "Estruturas Condicionais",
        conteudo: `<h3>Tomando Decisões</h3>
<p>Estruturas condicionais permitem que o programa tome decisões e siga caminhos diferentes com base em certas condições. A estrutura condicional mais comum é o "Se / Senão" (em inglês, <code>if / else</code>).</p>
<p>Pense no seguinte cenário do dia a dia:</p>
<pre><code>SE estiver chovendo:
    Levar guarda-chuva
SENÃO:
    Levar óculos de sol</code></pre>
<p>Na programação, usamos condicionais para verificar o status do usuário, por exemplo:</p>
<pre><code>SE nota >= 6:
    Mostrar "Aprovado!"
SENÃO:
    Mostrar "Estude um pouco mais!"</code></pre>
<p>Isso torna nossos programas inteligentes e dinâmicos!</p>`,
        quiz: {
          id: 205,
          pergunta: "Qual das opções descreve melhor a função de uma estrutura condicional?",
          alternativas: [
            "Repetir a mesma instrução centenas de vezes sem parar.",
            "Tomar decisões executando caminhos diferentes no código com base em condições.",
            "Converter texto em número de forma automática.",
            "Definir a cor de fundo de uma página da web."
          ],
          resposta_correta: 1
        }
      }
    ]
  },
  {
    id: "robotica",
    titulo: "Robótica",
    descricao: "Descubra como conectar o software ao mundo físico usando placas de prototipagem, sensores e motores.",
    imagem: "🤖",
    aulas: [
      {
        id: 106,
        ordem: 1,
        titulo: "Introdução à Robótica",
        conteudo: `<h3>O que é Robótica?</h3>
<p>Robótica é a área da ciência e da tecnologia que estuda o projeto, construção e programação de robôs. Um robô é uma máquina capaz de coletar informações do ambiente, tomar decisões e realizar ações físicas de forma automatizada ou semi-automatizada.</p>
<p>A robótica combina três áreas principais:</p>
<ol>
  <li><strong>Mecânica:</strong> A estrutura física e movimentação do robô.</li>
  <li><strong>Eletrônica:</strong> A fiação, energia, sensores e placas que dão "vida" e conectam os componentes.</li>
  <li><strong>Computação/Programação:</strong> O cérebro do robô, onde definimos como ele deve reagir a cada situação.</li>
</ol>`,
        quiz: {
          id: 206,
          pergunta: "Quais são as três áreas principais que compõem a robótica?",
          alternativas: [
            "Química, Biologia e História.",
            "Mecânica, Eletrônica e Programação.",
            "Design Gráfico, Redação e Marketing.",
            "Matemática Pura, Literatura e Geografia."
          ],
          resposta_correta: 1
        }
      },
      {
        id: 107,
        ordem: 2,
        titulo: "O que é Arduino",
        conteudo: `<h3>Conhecendo o Arduino</h3>
<p>O Arduino é uma plataforma de prototipagem eletrônica de código aberto (open-source) muito popular no mundo inteiro. Ela consiste em uma placa física com um microcontrolador (o cérebro) e um ambiente de desenvolvimento (o software IDE) onde programamos a placa.</p>
<p>Com o Arduino, qualquer pessoa pode construir projetos interativos conectando componentes como luzes (LEDs), motores, sensores de temperatura, som, luz e muito mais.</p>
<p>A placa mais famosa e recomendada para iniciantes é o <strong>Arduino UNO</strong>. Ela se conecta ao computador por um cabo USB por onde enviamos o código programado.</p>`,
        quiz: {
          id: 207,
          pergunta: "O que é o Arduino?",
          alternativas: [
            "Um videogame portátil voltado para jogos antigos.",
            "Uma linguagem de programação puramente teórica para computadores.",
            "Uma plataforma de prototipagem eletrônica composta por uma placa programável.",
            "Um tipo de sensor que serve apenas para detectar chuva."
          ],
          resposta_correta: 2
        }
      },
      {
        id: 108,
        ordem: 3,
        titulo: "Sensores",
        conteudo: `<h3>Os Olhos e Ouvidos do Robô</h3>
<p>Sensores são componentes que permitem ao robô perceber e interagir com o mundo ao seu redor. Eles transformam grandezas físicas (luz, temperatura, distância, presença) em sinais elétricos que o microcontrolador do Arduino consegue ler.</p>
<p>Exemplos de sensores comuns:</p>
<ul>
  <li><strong>LDR (Sensor de Luz):</strong> Percebe a luminosidade ambiente (útil para acender postes automáticos à noite).</li>
  <li><strong>Sensor Ultrassônico:</strong> Mede a distância de objetos enviando ondas de som (como fazem os morcegos).</li>
  <li><strong>DHT11 (Sensor de Temperatura e Umidade):</strong> Lê as condições climáticas locais.</li>
  <li><strong>Sensor de Presença (PIR):</strong> Detecta quando uma pessoa ou animal se move na área de alcance.</li>
</ul>`,
        quiz: {
          id: 208,
          pergunta: "Qual é o papel de um sensor em um projeto de robótica?",
          alternativas: [
            "Alimentar a placa com energia elétrica de alta voltagem.",
            "Permitir que o robô faça cálculos matemáticos complexos de forma mais rápida.",
            "Detectar informações físicas do ambiente e convertê-las em sinais para o microcontrolador.",
            "Girar rodas ou acender luzes de sinalização externa."
          ],
          resposta_correta: 2
        }
      },
      {
        id: 109,
        ordem: 4,
        titulo: "Atuadores",
        conteudo: `<h3>Fazendo Coisas Acontecerem</h3>
<p>Enquanto os sensores "sentem" o ambiente, os <strong>Atuadores</strong> são componentes que executam as ações físicas ditadas pelo robô.</p>
<p>Os atuadores transformam a energia elétrica recebida do microcontrolador em movimento, luz, som ou calor. Eles são os braços, pernas e voz do robô.</p>
<p>Exemplos de atuadores comuns:</p>
<ul>
  <li><strong>LEDs:</strong> Emitem luz de diversas cores.</li>
  <li><strong>Buzzer:</strong> Emite alertas sonoros e apitos.</li>
  <li><strong>Servomotor:</strong> Um motor que gira com precisão em ângulos de 0 a 180 graus (útil para braços mecânicos).</li>
  <li><strong>Motor DC comum:</strong> Utilizado para girar as rodas de carrinhos robóticos de forma rápida e contínua.</li>
</ul>`,
        quiz: {
          id: 209,
          pergunta: "Qual das opções a seguir é um exemplo de atuador?",
          alternativas: [
            "Sensor de luz LDR.",
            "Sensor ultrassônico de distância.",
            "Servomotor (que produz movimento mecânico).",
            "Termômetro digital de temperatura."
          ],
          resposta_correta: 2
        }
      },
      {
        id: 110,
        ordem: 5,
        titulo: "Primeiro Projeto: Semáforo Inteligente",
        conteudo: `<h3>Unindo Código e Eletrônica</h3>
<p>Nesse primeiro projeto teórico, criaremos um semáforo que simula o funcionamento real do trânsito usando 3 LEDs (Vermelho, Amarelo e Verde) e resistores para proteger a placa.</p>
<p>O algoritmo básico para programar no Arduino é:</p>
<pre><code>// Configuração inicial
void setup() {
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_AMARELO, OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);
}

// Execução contínua
void loop() {
  // Sinal Verde
  digitalWrite(LED_VERDE, HIGH);
  delay(5000); // 5 segundos
  digitalWrite(LED_VERDE, LOW);

  // Sinal Amarelo
  digitalWrite(LED_AMARELO, HIGH);
  delay(2000); // 2 segundos
  digitalWrite(LED_AMARELO, LOW);

  // Sinal Vermelho
  digitalWrite(LED_VERMELHO, HIGH);
  delay(5000); // 5 segundos
  digitalWrite(LED_VERMELHO, LOW);
}</code></pre>
<p>Com essa estrutura simples, os carros sabem exatamente quando andar e parar!</p>`,
        quiz: {
          id: 210,
          pergunta: "O que a função delay(5000) faz no código do Arduino?",
          alternativas: [
            "Apaga todas as luzes conectadas por 5 minutos.",
            "Pausa a execução do programa por 5.000 milissegundos (5 segundos).",
            "Muda a velocidade do motor para 5 km/h.",
            "Reinicia o microcontrolador do Arduino."
          ],
          resposta_correta: 1
        }
      }
    ]
  },
  {
    id: "inclusao_digital",
    titulo: "Inclusão Digital",
    descricao: "Aprenda a utilizar a internet de forma segura, cidadã e aproveitando as principais ferramentas digitais.",
    imagem: "🌐",
    aulas: [
      {
        id: 111,
        ordem: 1,
        titulo: "Uso da Internet",
        conteudo: `<h3>A Rede Mundial de Computadores</h3>
<p>A internet é uma rede gigante que conecta computadores do mundo inteiro. Através dela, podemos enviar mensagens, assistir aulas, pesquisar informações instantaneamente e compartilhar arquivos.</p>
<p>Para navegar na internet, usamos softwares chamados <strong>Navegadores (Browsers)</strong>, como o Google Chrome, Mozilla Firefox, Safari ou Microsoft Edge. Cada site possui um endereço único chamado URL (por exemplo, <code>www.google.com</code>).</p>
<p>Para o bom uso da internet, é importante ter boas conexões e entender como funcionam os motores de busca, ajudando a encontrar informações confiáveis rapidamente.</p>`,
        quiz: {
          id: 211,
          pergunta: "Qual software é utilizado para navegar e visualizar sites na internet?",
          alternativas: [
            "Editor de planilhas eletrônicas.",
            "Navegador (Browser).",
            "Reprodutor de música local.",
            "Calculadora do sistema."
          ],
          resposta_correta: 1
        }
      },
      {
        id: 112,
        ordem: 2,
        titulo: "Segurança Digital",
        conteudo: `<h3>Protegendo-se Online</h3>
<p>Assim como cuidamos da nossa segurança física ao fechar a porta de casa, precisamos proteger nossos dados e dispositivos no mundo digital. O ambiente online possui ameaças como vírus, golpes de roubo de dados e fraudes.</p>
<p>Dicas de segurança fundamentais:</p>
<ul>
  <li><strong>Senhas Fortes:</strong> Use combinações de letras maiúsculas, minúsculas, números e símbolos (ex: <code>#Forte@2026</code>). Evite usar datas de nascimento ou nomes simples.</li>
  <li><strong>Desconfie de links:</strong> Nunca clique em links que prometem prêmios extravagantes ou solicitam seus dados bancários via mensagens suspeitas.</li>
  <li><strong>Verificação em duas etapas:</strong> Ative essa camada extra nas suas contas de redes sociais e e-mails sempre que disponível.</li>
</ul>`,
        quiz: {
          id: 212,
          pergunta: "Qual das opções a seguir representa uma prática de segurança digital forte?",
          alternativas: [
            "Usar a senha '123456' em todos os seus cadastros para não esquecer.",
            "Clicar em todos os links e anúncios promocionais que recebe no WhatsApp.",
            "Utilizar senhas complexas e diferentes para cada conta, além de ativar autenticação em duas etapas.",
            "Anotar suas senhas no verso do celular sem proteção adicional."
          ],
          resposta_correta: 2
        }
      },
      {
        id: 113,
        ordem: 3,
        titulo: "Ferramentas Digitais",
        conteudo: `<h3>Facilitando o Trabalho e Estudo</h3>
<p>As ferramentas digitais são softwares ou serviços online criados para nos ajudar a organizar rotinas, criar projetos e trabalhar com eficiência. Elas podem ser usadas tanto no computador quanto no celular.</p>
<p>Algumas ferramentas muito importantes no dia a dia:</p>
<ul>
  <li><strong>Editores de Texto (ex: Google Docs, Word):</strong> Usados para escrever trabalhos, relatórios, livros e resumos.</li>
  <li><strong>Planilhas (ex: Google Sheets, Excel):</strong> Excelentes para fazer orçamentos familiares, tabelas e cálculos automáticos.</li>
  <li><strong>Apresentações (ex: Google Slides, PowerPoint):</strong> Ideais para criar slides explicativos para aulas ou reuniões de trabalho.</li>
</ul>`,
        quiz: {
          id: 213,
          pergunta: "Qual é a ferramenta mais indicada se você precisa fazer o controle financeiro de sua casa com somas automáticas?",
          alternativas: [
            "Um software de apresentação de slides.",
            "Um aplicativo de planilhas eletrônicas (como Excel ou Google Sheets).",
            "Um reprodutor de vídeo.",
            "Um navegador de internet apenas."
          ],
          resposta_correta: 1
        }
      },
      {
        id: 114,
        ordem: 4,
        titulo: "Cidadania Digital",
        conteudo: `<h3>Comportamento Ético na Rede</h3>
<p>Cidadania digital diz respeito a como nos comportamos, interagimos e respeitamos os outros no ambiente digital. A internet não é uma "terra sem leis": as nossas palavras e ações na rede têm consequências reais.</p>
<p>Práticas da cidadania digital saudável:</p>
<ul>
  <li><strong>Empatia e Respeito:</strong> Evite fazer comentários ofensivos ou praticar cyberbullying. Trate os outros como gostaria de ser tratado.</li>
  <li><strong>Combate a Fake News:</strong> Sempre verifique a veracidade de uma notícia antes de compartilhar. Compartilhar boatos mentirosos prejudica a comunidade.</li>
  <li><strong>Pegada Digital:</strong> Lembre-se que tudo que você publica deixa um rastro na internet que pode durar muitos anos.</li>
</ul>`,
        quiz: {
          id: 214,
          pergunta: "Qual atitude condiz com os princípios da Cidadania Digital?",
          alternativas: [
            "Compartilhar notícias chocantes e urgentes sem verificar se são verdadeiras.",
            "Postar ofensas contra pessoas que discordam de você em fóruns públicos.",
            "Praticar a empatia nas interações online e verificar informações antes de compartilhá-las.",
            "Criar perfis falsos para espalhar mentiras anônimas na internet."
          ],
          resposta_correta: 2
        }
      }
    ]
  }
];

// Tornar disponível globalmente se estiver rodando no navegador
if (typeof window !== 'undefined') {
  window.TRILHAS_DATA = TRILHAS_DATA;
}
