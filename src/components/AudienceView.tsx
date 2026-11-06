import React, { useEffect, useState } from 'react';
import { SCENES_CONFIG } from '../data/presentationData';
import { ShieldCheck, RotateCcw, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface AudienceViewProps {
  currentSceneIndex: number;
  onOpenPilotModal: () => void;
  isPreview?: boolean;
}

export const AudienceView: React.FC<AudienceViewProps> = ({
  currentSceneIndex,
  onOpenPilotModal,
  isPreview = false
}) => {
  // Scene 4 (Dual Demo) active log items
  const [activeLogs, setActiveLogs] = useState<Record<string, boolean>>({});
  const [isVortexAbsorbed, setIsVortexAbsorbed] = useState(false);

  // Scene 6 Counter animation
  const [counterValues, setCounterValues] = useState<{ [key: string]: number }>({
    time: 0,
    noshow: 0,
    payout: 0
  });

  // Handle Scene 3 vortex absorption transition
  useEffect(() => {
    if (currentSceneIndex === 3) {
      setIsVortexAbsorbed(false);
      const timer = setTimeout(() => {
        setIsVortexAbsorbed(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsVortexAbsorbed(false);
    }
  }, [currentSceneIndex]);

  // Handle Scene 4 dual demo steps
  const runDualDemoSimulation = (fast = false) => {
    setActiveLogs({});
    const schedule = [
      { key: 'estLog1', delay: fast ? 150 : 500 },
      { key: 'freeLog1', delay: fast ? 550 : 1100 },
      { key: 'estLog2', delay: fast ? 1000 : 1800 },
      { key: 'freeLog2', delay: fast ? 1500 : 2400 },
      { key: 'estLog3', delay: fast ? 2000 : 3000 },
      { key: 'freeLog3', delay: fast ? 2500 : 3600 },
      { key: 'estLog4', delay: fast ? 3100 : 4300 },
      { key: 'freeLog4', delay: fast ? 3500 : 4800 },
    ];

    const timers = schedule.map(item =>
      setTimeout(() => {
        setActiveLogs(prev => ({ ...prev, [item.key]: true }));
      }, item.delay)
    );

    return () => timers.forEach(t => clearTimeout(t));
  };

  useEffect(() => {
    if (currentSceneIndex === 4) {
      const cleanup = runDualDemoSimulation(false);
      return cleanup;
    }
  }, [currentSceneIndex]);

  // Handle Scene 6 metric counter animation
  useEffect(() => {
    if (currentSceneIndex === 6) {
      const duration = 1200;
      const start = performance.now();
      const targets = { time: 4, noshow: 3, payout: 0 };

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 2);
        setCounterValues({
          time: Math.round(ease * targets.time),
          noshow: Math.round(ease * targets.noshow),
          payout: 0
        });
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      const frame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frame);
    }
  }, [currentSceneIndex]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0c] text-[#f3f4f6]">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        <div className="animate-drift-glow-1 absolute -top-[20%] -right-[12%] w-[75vw] h-[75vw] max-w-[880px] max-h-[880px] rounded-full bg-[radial-gradient(circle,rgba(255,45,122,0.38)_0%,rgba(255,45,122,0.04)_45%,transparent_70%)] blur-[85px] opacity-65" />
        <div className="animate-drift-glow-2 absolute -bottom-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[720px] max-h-[720px] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18)_0%,transparent_65%)] blur-[95px] opacity-45" />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.032) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.032) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 45%, transparent 90%)'
          }}
        />
      </div>

      {/* Brand mark header (hidden in preview iframe) */}
      {!isPreview && (
        <div className="fixed top-4 left-6 sm:top-7 sm:left-12 z-40 flex items-center gap-2.5 font-mono text-[11px] sm:text-xs tracking-[0.18em] uppercase text-white/45 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-[#ff2d7a] shadow-[0_0_10px_#ff2d7a]" />
          <span>TRAMPAKI · MATCHING ON-DEMAND COM IA</span>
        </div>
      )}

      {/* Slide Navigation Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 flex gap-1 bg-white/5">
        {SCENES_CONFIG.map((s, idx) => (
          <div
            key={idx}
            className={`h-full transition-all duration-300 ${
              idx === currentSceneIndex
                ? 'bg-[#ff2d7a] shadow-[0_0_8px_#ff2d7a]'
                : idx < currentSceneIndex
                ? 'bg-[#ff2d7a]/40'
                : 'bg-white/10'
            }`}
            style={{ width: `${(s.duration / 180) * 100}%` }}
          />
        ))}
      </div>

      {/* Main Stage Scenes */}
      <main className="relative w-full h-full z-10">
        {/* ========================================= */}
        {/* SCENE 0: A PROVOCAÇÃO */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-24 py-12 flex flex-col justify-center transition-all duration-500 ${
            currentSceneIndex === 0
              ? 'opacity-100 visible scale-100 pointer-events-auto scene-active'
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-4 flex items-center gap-3">
            <span>01 / A PROVOCAÇÃO</span>
            <span className="w-9 h-[1px] bg-[#ff2d7a]/40" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight max-w-[18ch] text-white mb-6">
            CONTRATAR UM TURNO DE URGÊNCIA LEVA
          </h1>

          <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-snug text-neutral-300 flex flex-wrap items-center gap-3 md:gap-5">
            <span className="strikethrough-reveal text-neutral-400">3 dias no desespero.</span>
            <span className="real-answer-reveal text-white font-extrabold flex items-center gap-2">
              <span className="text-[#38bdf8]">4 minutos</span> com IA.
            </span>
          </div>
        </section>

        {/* ========================================= */}
        {/* SCENE 1: O CAOS DA ÚLTIMA HORA */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-20 py-12 flex flex-col justify-center transition-all duration-500 ${
            currentSceneIndex === 1
              ? 'opacity-100 visible scale-100 pointer-events-auto'
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center w-full">
            <div className="lg:col-span-7">
              <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-4 flex items-center gap-3">
                <span>02 / O CAOS DA ÚLTIMA HORA</span>
                <span className="w-9 h-[1px] bg-[#ff2d7a]/40" />
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
                Bares perdem mesas. Autônomos perdem renda.
              </h2>
              <p className="text-base sm:text-xl text-neutral-400 leading-relaxed max-w-[48ch]">
                Grupos caóticos de WhatsApp, no-shows sem aviso prévio, calotes informais e escalas de plantão remendadas às 19h de sábado.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-wrap gap-3.5 p-4 justify-center items-center">
              {[
                { name: 'grupo_zap_freelas_sp.chat', delay: '0s' },
                { name: 'garçom_faltou_19:45.msg', delay: '-1.2s' },
                { name: 'pix_pendente_sem_comprovante.jpg', delay: '-2.8s' },
                { name: 'escala_desfalque_sabado.xlsx', delay: '-4s' },
                { name: 'alguém indica barman urgente??', delay: '-1.5s' },
                { name: 'comanda_travada_por_falta_braço.log', delay: '-3.1s' },
                { name: 'áudio_desculpa_furou_01:12.mp3', delay: '-2.2s' },
                { name: 'fechamento_caixa_prejuízo.csv', delay: '-0.7s' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="font-mono text-xs md:text-sm px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-neutral-300 shadow-lg flex items-center gap-2.5 backdrop-blur-md"
                  style={{
                    animation: `floatTag 6.5s ease-in-out infinite alternate ${item.delay}`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d7a]/70 shadow-[0_0_6px_#ff2d7a]" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* SCENE 2: A REALIDADE DA OPERAÇÃO */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-24 py-12 flex flex-col justify-center transition-all duration-500 ${
            currentSceneIndex === 2
              ? 'opacity-100 visible scale-100 pointer-events-auto'
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="max-w-4xl">
            <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-4 flex items-center gap-3">
              <span>03 / A REALIDADE DA OPERAÇÃO</span>
              <span className="w-9 h-[1px] bg-[#ff2d7a]/40" />
            </div>

            <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 border-l-4 border-l-[#ff2d7a] rounded-2xl p-6 sm:p-10 mb-8 shadow-2xl backdrop-blur-md">
              <p className="text-xl sm:text-3xl md:text-4xl font-bold leading-snug text-white tracking-tight mb-6">
                "Uma sexta-feira com dois garçons a menos custa 30% do faturamento da noite e queima a reputação da casa."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff2d7a] to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-base shadow-md">
                  RR
                </div>
                <div>
                  <div className="font-semibold text-white text-base">Ricardo Rocha</div>
                  <div className="font-mono text-xs text-neutral-400">Proprietário de Bar &amp; Restaurante · SP</div>
                </div>
              </div>
            </div>

            <div className="font-mono text-sm sm:text-base md:text-lg text-[#ff2d7a] flex items-center gap-3">
              <span className="text-xl">→</span>
              <span>Como transformar uma falta de última hora em um turno preenchido e verificado em minutos?</span>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* SCENE 3: O MOTOR TRAMPAKI (VORTEX) */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-24 py-12 flex flex-col justify-center transition-all duration-500 ${
            currentSceneIndex === 3
              ? `opacity-100 visible scale-100 pointer-events-auto ${isVortexAbsorbed ? 'vortex-absorbed' : ''}`
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-2 flex items-center justify-center gap-3">
            <span>04 / O MOTOR TRAMPAKI</span>
          </div>

          <div className="relative h-64 sm:h-72 w-full max-w-3xl mx-auto my-3 flex items-center justify-center" aria-hidden="true">
            {/* Center Core */}
            <div className="animate-pulse-core relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[radial-gradient(circle,#ff2d7a_0%,rgba(255,45,122,0.35)_45%,transparent_75%)] border-2 border-[#ff2d7a] shadow-[0_0_55px_rgba(255,45,122,0.4)] flex flex-col items-center justify-center">
              <span className="font-mono text-xs sm:text-sm font-extrabold uppercase text-white tracking-wider">TRAMPAKI</span>
              <span className="font-mono text-[9px] text-[#38bdf8] font-bold mt-0.5 tracking-widest">GEMINI AI</span>
            </div>

            {/* Orbiting / absorbing fragments */}
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 top-[8%] left-[8%]">grupo_zap_freelas.chat</div>
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 top-[12%] right-[10%]">garçom_faltou_19:45.msg</div>
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 bottom-[15%] left-[12%]">pix_pendente.jpg</div>
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 bottom-[18%] right-[12%]">escala_sabado.xlsx</div>
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 top-[48%] left-[4%]">áudio_desculpa.mp3</div>
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 top-[46%] right-[4%]">alguém_indica_urgente?</div>
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 top-[2%] left-[45%]">comanda_travada.log</div>
            <div className="absorbing-fragment-base absolute font-mono text-[11px] sm:text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 text-neutral-300 bottom-[4%] left-[46%]">fechamento_prejuízo.csv</div>
          </div>

          <div className="vortex-punchline-base text-center max-w-3xl mx-auto mt-2">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
              Trampaki: O marketplace inteligente de turnos sob demanda.
            </h2>
            <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Match neural instantâneo via Google Gemini: geolocalização precisa, reputação auditada e liquidação imediata.
            </p>
          </div>
        </section>

        {/* ========================================= */}
        {/* SCENE 4: SIMULAÇÃO AO VIVO DUPLA */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-20 py-8 md:py-12 flex flex-col justify-center transition-all duration-500 overflow-y-auto ${
            currentSceneIndex === 4
              ? 'opacity-100 visible scale-100 pointer-events-auto'
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="max-w-6xl w-full mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-1.5">
                  05 / SIMULAÇÃO AO VIVO EM TEMPO REAL
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  Do desfalque ao check-in em 4 passos sincronizados.
                </h2>
              </div>
              <button
                onClick={() => runDualDemoSimulation(true)}
                className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 hover:text-white font-mono text-xs transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repetir Simulação</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {/* Flow 1: Estabelecimento */}
              <div className="bg-[#0f1118]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 font-semibold">
                      Estabelecimento · Bar do Lago
                    </span>
                    <span className="font-mono text-xs text-[#38bdf8]">Trampaki Business</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs sm:text-[13px]">
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-[#ff2d7a] transition-all duration-300 ${activeLogs.estLog1 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      1. Cadastra plantão: Barman Urgente (19h - 02h) · R$ 180,00
                    </div>
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-[#ff2d7a] transition-all duration-300 ${activeLogs.estLog2 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      2. Gemini AI audita alíquota, perfil de coquetelaria e raio de 2.5km
                    </div>
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-[#ff2d7a] transition-all duration-300 ${activeLogs.estLog3 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      3. Disparando matching geolocalizado para 14 profissionais qualificados...
                    </div>
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-emerald-500 text-emerald-300 font-semibold transition-all duration-300 ${activeLogs.estLog4 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      4. Turno aceito por Carlos M. (Score 98%) · Valor retido em escrow seguro
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-[#ff2d7a]/[0.08] border border-dashed border-[#ff2d7a] rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white text-sm">Vaga: Barman Sênior</strong>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                      <Zap className="w-3 h-3" /> IA Gemini Match
                    </span>
                  </div>
                  <div className="text-neutral-400">Hoje, 19:00 - 02:00 · Vila Madalena, SP</div>
                </div>
              </div>

              {/* Flow 2: Colaborador / Freelancer */}
              <div className="bg-[#0f1118]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#ff2d7a]/10 text-[#ff2d7a] border border-[#ff2d7a]/30 font-semibold">
                      Colaborador · Carlos M.
                    </span>
                    <span className="font-mono text-xs text-[#ff2d7a]">Trampaki Pro</span>
                  </div>

                  <div className="space-y-2 font-mono text-xs sm:text-[13px]">
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-[#ff2d7a] transition-all duration-300 ${activeLogs.freeLog1 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      1. Push recebido: Turno urgente a 1.2km da sua localização atual
                    </div>
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-[#ff2d7a] transition-all duration-300 ${activeLogs.freeLog2 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      2. Card Inteligente exibido: R$ 180 limpos + Gorjetas + Jantar incluso
                    </div>
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-[#ff2d7a] transition-all duration-300 ${activeLogs.freeLog3 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      3. Aceite com 1 clique · Contrato temporário emitido na hora
                    </div>
                    <div className={`p-2.5 rounded-lg bg-white/[0.03] border-l-2 border-l-emerald-500 text-emerald-300 font-semibold transition-all duration-300 ${activeLogs.freeLog4 ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-1'}`}>
                      4. Check-in por GPS validado · Pix automático provisionado no checkout!
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-[#38bdf8]/[0.08] border border-dashed border-[#38bdf8] rounded-xl text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white text-sm">Carlos Mendes (Barman)</strong>
                    <span className="font-mono font-bold text-[#38bdf8] text-xs">★ 4.9 (42 turnos)</span>
                  </div>
                  <div className="text-neutral-400">Liquidação instantânea garantida via Pix</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* SCENE 5: ARQUITETURA NO GOOGLE AI STUDIO */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-24 py-12 flex flex-col justify-center transition-all duration-500 ${
            currentSceneIndex === 5
              ? 'opacity-100 visible scale-100 pointer-events-auto'
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="max-w-5xl mx-auto w-full">
            <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-4 flex items-center gap-3">
              <span>06 / ARQUITETURA NO GOOGLE AI STUDIO</span>
              <span className="w-9 h-[1px] bg-[#ff2d7a]/40" />
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-8">
              Triagem Neural e Liquidação Instantânea.
            </h2>

            {/* Pipeline nodes */}
            <div className="relative my-8">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 z-0 overflow-hidden">
                <div className="animate-laser-flow absolute top-0 w-1/4 h-full bg-gradient-to-r from-transparent via-[#ff2d7a] to-white shadow-[0_0_12px_#ff2d7a]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="bg-[#101116]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-[#ff2d7a]/50 transition">
                  <div className="font-mono text-xs text-[#ff2d7a] font-bold mb-2">NÓ 01</div>
                  <h3 className="text-lg font-bold text-white mb-2">Triagem Automática</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Verificação de antecedentes, pontualidade histórica e reputação blindada contra perfis falsos.
                  </p>
                </div>

                <div className="bg-[#101116]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-[#38bdf8]/50 transition">
                  <div className="font-mono text-xs text-[#38bdf8] font-bold mb-2">NÓ 02</div>
                  <h3 className="text-lg font-bold text-white mb-2">Match Gemini AI</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Algoritmo no Google AI Studio cruzando urgência operacional, raio de proximidade GPS e compatibilidade de habilidades.
                  </p>
                </div>

                <div className="bg-[#101116]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:border-emerald-500/50 transition">
                  <div className="font-mono text-xs text-emerald-400 font-bold mb-2">NÓ 03</div>
                  <h3 className="text-lg font-bold text-white mb-2">Escrow &amp; Repasse Pix</h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    O contratante garante o valor no momento do aceite e o profissional recebe no checkout auditado por geofence.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-8">
              <span className="font-mono text-xs text-neutral-500 uppercase">Powered by:</span>
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-[#38bdf8]/40 text-[#38bdf8]">
                Google Gemini 1.5 Pro
              </span>
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                Google AI Studio
              </span>
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                Pix Instantâneo BACEN
              </span>
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                Geofence GPS
              </span>
              <span className="font-mono text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                WhatsApp API Cloud
              </span>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* SCENE 6: RETORNO COMPROVADO */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-24 py-12 flex flex-col justify-center transition-all duration-500 ${
            currentSceneIndex === 6
              ? 'opacity-100 visible scale-100 pointer-events-auto'
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="max-w-5xl mx-auto w-full">
            <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-4 flex items-center gap-3">
              <span>07 / RETORNO COMPROVADO</span>
              <span className="w-9 h-[1px] bg-[#ff2d7a]/40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
                <span className="font-mono text-sm text-neutral-500 line-through block mb-2">~48 horas no zap</span>
                <div className="text-5xl sm:text-7xl font-extrabold text-white leading-none tracking-tight mb-2">
                  <span>{counterValues.time}</span>
                  <span className="text-[#ff2d7a] text-3xl sm:text-4xl ml-1 font-bold">min</span>
                </div>
                <div className="text-sm text-neutral-400">Tempo médio para preenchimento de turno</div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
                <span className="font-mono text-sm text-neutral-500 line-through block mb-2">35% de desistência</span>
                <div className="text-5xl sm:text-7xl font-extrabold text-white leading-none tracking-tight mb-2">
                  <span>&lt;{counterValues.noshow}</span>
                  <span className="text-[#ff2d7a] text-3xl sm:text-4xl ml-1 font-bold">%</span>
                </div>
                <div className="text-sm text-neutral-400">Taxa de no-show com confirmação por IA</div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8">
                <span className="font-mono text-sm text-neutral-500 line-through block mb-2">15 a 30 dias de espera</span>
                <div className="text-5xl sm:text-7xl font-extrabold text-white leading-none tracking-tight mb-2">
                  <span>0</span>
                  <span className="text-[#ff2d7a] text-3xl sm:text-4xl ml-1 font-bold">seg</span>
                </div>
                <div className="text-sm text-neutral-400">Repasse imediato após encerramento do turno</div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-200 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Score de Reputação Blindado</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-200 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Split de Pagamento Seguro</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-neutral-200 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Termo de Autonomia Jurídica</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================= */}
        {/* SCENE 7: FECHAMENTO & CTA */}
        {/* ========================================= */}
        <section
          className={`absolute inset-0 w-full h-full px-6 sm:px-12 md:px-24 py-12 flex flex-col justify-center transition-all duration-500 ${
            currentSceneIndex === 7
              ? 'opacity-100 visible scale-100 pointer-events-auto'
              : 'opacity-0 invisible scale-[0.985] pointer-events-none'
          }`}
        >
          <div className="max-w-5xl">
            <div className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.22em] text-[#ff2d7a] mb-4 flex items-center gap-3">
              <span>08 / PRÓXIMO PASSO</span>
              <span className="w-9 h-[1px] bg-[#ff2d7a]/40" />
            </div>

            <h2 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8">
              O TRABALHO FLEXÍVEL PRECISA DE PREVISIBILIDADE.
            </h2>

            <div>
              <button
                onClick={onOpenPilotModal}
                className="inline-flex items-center gap-3 bg-[#ff2d7a] hover:bg-[#ff1a6e] text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold text-base sm:text-xl shadow-[0_10px_35px_rgba(255,45,122,0.45)] hover:shadow-[0_14px_45px_rgba(255,45,122,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
              >
                <span>Agendar piloto no seu estabelecimento</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating subtle shortcuts hint at bottom of audience view */}
      {!isPreview && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 hidden sm:flex items-center gap-2 bg-[#101118]/90 border border-white/10 rounded-full px-4 py-1.5 font-mono text-[11px] text-neutral-400 backdrop-blur-md shadow-2xl pointer-events-none">
          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-semibold">P</span> modo apresentador ·{' '}
          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-semibold">F</span> tela cheia ·{' '}
          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-semibold">?</span> atalhos
        </div>
      )}
    </div>
  );
};
