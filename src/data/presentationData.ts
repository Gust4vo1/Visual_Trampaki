import { SceneConfig } from '../types/presentation';

export const TOTAL_DURATION_SECONDS = 180;

export const SCENES_CONFIG: SceneConfig[] = [
  {
    index: 0,
    kicker: "01 / A PROVOCAÇÃO",
    title: "01 / A Provocação",
    name: "O Custo da Urgência",
    duration: 20,
    script: `
      <span class="stage-note">[OLHAR DIRETO PARA OS AVALIADORES · TOM ENÉRGICO]</span>
      Quantas vezes vocês já foram a um bar ou restaurante e a comida atrasou 40 minutos porque a equipe estava desfalcada?
      <span class="stage-note">[PAUSA DE 1 SEGUNDO]</span>
      Hoje, quando um funcionário falta numa sexta à noite, o dono do negócio leva <span class="key-phrase">três dias ligando para conhecidos ou implorando em grupos</span>.
      Com o Trampaki, esse mesmo turno crítico é preenchido e validado em <span class="key-phrase">exatos quatro minutos</span>.
    `
  },
  {
    index: 1,
    kicker: "02 / O CAOS DA ÚLTIMA HORA",
    title: "02 / O Caos da Última Hora",
    name: "A Fragmentação do Setor",
    duration: 25,
    script: `
      <span class="stage-note">[GESTO APONTANDO PARA A NUVEM DE FRAGMENTOS À DIREITA]</span>
      Vejam a realidade do setor de hospitalidade e eventos hoje. Grupos lotados no WhatsApp, garçons que somem sem avisar e donos de bares desesperados às 19h45 de sábado.
      <span class="stage-note">[MUDANÇA DE TOM]</span>
      Do outro lado, <span class="key-phrase">milhares de profissionais qualificados querem trabalhar</span>, mas ficam reféns de calotes, atrasos de 30 dias para receber a diária e falta de garantias. É um mercado de bilhões operando no escuro.
    `
  },
  {
    index: 2,
    kicker: "03 / A REALIDADE DA OPERAÇÃO",
    title: "03 / A Realidade da Persona",
    name: "A Dor do Ricardo",
    duration: 20,
    script: `
      Conheçam o Ricardo, dono de um bar movimentado em São Paulo.
      Ele nos disse com todas as letras: <span class="key-phrase">"Uma sexta-feira com dois garçons a menos custa 30% do faturamento da noite e destrói minha reputação no Google"</span>.
      <span class="stage-note">[AVANÇAR UM PASSO]</span>
      E isso nos levou ao nosso desafio no Google AI Studio: <span class="key-phrase">Como transformar uma emergência operacional em um turno preenchido e seguro antes da primeira comanda abrir?</span>
    `
  },
  {
    index: 3,
    kicker: "04 / O MOTOR TRAMPAKI",
    title: "04 / O Ponto de Inflexão",
    name: "Apresentando o Trampaki",
    duration: 25,
    script: `
      <span class="stage-note">[OBSERVAR OS FRAGMENTOS SENDO ABSORVIDOS PELO NÚCLEO GEMINI]</span>
      E a nossa resposta é o <span class="key-phrase">Trampaki</span>.
      Nós conectamos estabelecimentos e autônomos em um marketplace sob demanda de altíssima velocidade.
      <span class="stage-note">[ENFATIZAR O MATCH INTELIGENTE]</span>
      Nosso motor neural alimentado pelo Google Gemini analisa reputação, histórico de pontualidade e distância geográfica para fazer o <span class="key-phrase">match perfeito sem atrito e sem intermediários burocráticos</span>.
    `
  },
  {
    index: 4,
    kicker: "05 / SIMULAÇÃO AO VIVO EM TEMPO REAL",
    title: "05 / Simulação ao Vivo",
    name: "Demo Estabelecimento x Colaborador",
    duration: 35,
    script: `
      <span class="stage-note">[APONTAR PARA AS DUAS TELAS SINCRONIZADAS]</span>
      Vejam a mágica acontecendo na prática.
      À esquerda, o bar publica um turno urgente: Barman para hoje, R$ 180, das 19h às 2h da manhã. O Gemini AI valida a taxa justa e dispara o alerta em 2.5km.
      <span class="stage-note">[MOSTRAR A TELA DA DIREITA]</span>
      Na mesma fração de segundo, o Carlos recebe o card com 98% de compatibilidade. Ele aceita com um toque.
      O contrato temporário é gerado e o pagamento já fica garantido em escrow. <span class="key-phrase">Zero risco para quem contrata, zero risco para quem trabalha</span>.
    `
  },
  {
    index: 5,
    kicker: "06 / ARQUITETURA NO GOOGLE AI STUDIO",
    title: "06 / Arquitetura e IA",
    name: "Google AI Studio em Ação",
    duration: 20,
    script: `
      <span class="stage-note">[ACOMPANHAR O FEIXE DE LUZ DO PIPELINE]</span>
      Nossa infraestrutura foi construída sobre três pilares herméticos no ecossistema Google AI Studio.
      Triagem preventiva contra perfis falsos; algoritmo preditivo de match via Gemini 1.5 Pro; e liquidação instantânea via Pix com check-in auditado por cerca digital de GPS.
      <span class="key-phrase">É tecnologia de ponta aplicada à economia real</span>.
    `
  },
  {
    index: 6,
    kicker: "07 / RETORNO COMPROVADO",
    title: "07 / Retorno Comprovado",
    name: "Métricas de Impacto",
    duration: 20,
    script: `
      <span class="stage-note">[DESTAQUE PARA OS NÚMEROS ANIMADOS]</span>
      Os números dos nossos primeiros pilotos falam por si:
      O tempo para cobrir um turno caiu de 48 horas para <span class="key-phrase">apenas 4 minutos</span>.
      A taxa de no-show desabou de 35% para <span class="key-phrase">menos de 3%</span>.
      E o colaborador recebe no mesmo minuto pelo Pix. Eliminamos a dor de cabeça e colocamos dinheiro no bolso de quem produz.
    `
  },
  {
    index: 7,
    kicker: "08 / PRÓXIMO PASSO",
    title: "08 / Fechamento & CTA",
    name: "O Chamado para Ação",
    duration: 15,
    script: `
      <span class="stage-note">[CONTATO VISUAL FIRME · TOM DE ENCERRAMENTO CONFIANTE]</span>
      O futuro do trabalho flexível não pode depender da sorte ou de mensagens perdidas no WhatsApp.
      <span class="key-phrase">O trabalho flexível precisa de inteligência, dignidade e previsibilidade.</span>
      Estamos abrindo 10 vagas para a próxima turma de estabelecimentos parceiros em São Paulo.
      Venham falar conosco e vamos transformar a escala do seu negócio agora. Muito obrigado!
    `
  }
];
