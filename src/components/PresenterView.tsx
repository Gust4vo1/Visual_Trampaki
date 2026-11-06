import React, { useMemo } from 'react';
import { SCENES_CONFIG, TOTAL_DURATION_SECONDS } from '../data/presentationData';
import { AudienceView } from './AudienceView';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, HelpCircle, Monitor } from 'lucide-react';

interface PresenterViewProps {
  currentSceneIndex: number;
  onGoToScene: (index: number) => void;
  onNextScene: () => void;
  onPrevScene: () => void;
  onResetPresentation: () => void;
  elapsedTotalSeconds: number;
  sceneElapsedSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  isAudienceConnected: boolean;
  onOpenHelp: () => void;
  onSwitchToAudience: () => void;
  onOpenPilotModal: () => void;
}

export const PresenterView: React.FC<PresenterViewProps> = ({
  currentSceneIndex,
  onGoToScene,
  onNextScene,
  onPrevScene,
  onResetPresentation,
  elapsedTotalSeconds,
  sceneElapsedSeconds,
  isTimerRunning,
  onToggleTimer,
  isAudienceConnected,
  onOpenHelp,
  onSwitchToAudience,
  onOpenPilotModal,
}) => {
  const currentScene = SCENES_CONFIG[currentSceneIndex];
  const nextScene = SCENES_CONFIG[currentSceneIndex + 1];

  // Timing calculations
  const sceneRemaining = currentScene.duration - sceneElapsedSeconds;
  const totalRemaining = Math.max(0, TOTAL_DURATION_SECONDS - elapsedTotalSeconds);

  const formatClock = (seconds: number) => {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Pacing calculation
  const pacing = useMemo(() => {
    let targetElapsed = 0;
    for (let i = 0; i <= currentSceneIndex; i++) {
      targetElapsed += SCENES_CONFIG[i].duration;
    }
    const idealAtMoment = targetElapsed - (currentScene.duration - sceneElapsedSeconds);
    const diff = elapsedTotalSeconds - idealAtMoment;

    if (diff > 4) {
      return { status: 'behind', text: `Atrasado · acelere (+${diff}s)`, class: 'text-rose-400 border-rose-500/40 bg-rose-500/10' };
    }
    if (diff < -4) {
      return { status: 'ahead', text: `Adiantado · respire (${diff}s)`, class: 'text-sky-400 border-sky-500/40 bg-sky-500/10' };
    }
    return { status: 'on-track', text: 'No ritmo ideal', class: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
  }, [currentSceneIndex, currentScene.duration, sceneElapsedSeconds, elapsedTotalSeconds]);

  return (
    <div className="w-full h-full bg-[#08080a] text-neutral-200 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Header */}
      <header className="px-6 py-3.5 bg-[#0f1118] border-b border-white/10 flex items-center justify-between gap-4 z-20 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs sm:text-sm font-bold text-white flex items-center gap-3">
            <span className="text-[#ff2d7a]">◆</span>
            <span>TRAMPAKI · PAINEL DO APRESENTADOR</span>
          </div>

          <div
            className={`font-mono text-[11px] px-2.5 py-1 rounded-full border flex items-center gap-2 transition-all ${
              isAudienceConnected
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isAudienceConnected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'
              }`}
            />
            <span>{isAudienceConnected ? 'Plateia sincronizada' : 'Modo console ativo'}</span>
          </div>
        </div>

        {/* Timers & Pacing */}
        <div className="flex items-center gap-6 font-mono">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">Cena Atual</span>
            <span
              className={`text-xl font-bold ${
                sceneRemaining < 0
                  ? 'text-rose-500 animate-pulse'
                  : sceneRemaining <= 5
                  ? 'text-amber-400'
                  : 'text-white'
              }`}
            >
              {sceneRemaining < 0 ? `+${Math.abs(sceneRemaining)}s` : formatClock(sceneRemaining)}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400">Tempo Total</span>
            <span className={`text-xl font-bold ${totalRemaining === 0 ? 'text-rose-500' : 'text-white'}`}>
              {formatClock(totalRemaining)}
            </span>
          </div>

          <div className={`font-mono text-xs px-3 py-1.5 rounded-lg border font-semibold ${pacing.class}`}>
            {pacing.text}
          </div>

          <button
            onClick={onSwitchToAudience}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white transition cursor-pointer"
            title="Ver visualização da plateia"
          >
            <Monitor className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Ver Plateia</span>
          </button>
        </div>
      </header>

      {/* Main Workspace (Split View) */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#08080a]">
        {/* Left column: Live audience preview & Next slide */}
        <section className="lg:col-span-5 border-r border-white/10 p-5 bg-[#0c0d13] flex flex-col gap-4 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                Prévia ao Vivo da Plateia
              </span>
              <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AO VIVO
              </span>
            </div>

            {/* Miniature Live Preview Frame */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/15 relative shadow-2xl">
              <div className="absolute inset-0 pointer-events-none transform scale-100 origin-top-left">
                <AudienceView
                  currentSceneIndex={currentSceneIndex}
                  onOpenPilotModal={onOpenPilotModal}
                  isPreview={true}
                />
              </div>
            </div>
          </div>

          {/* Next Scene Preview Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
              A Seguir (Próximo Slide)
            </div>
            <div className="text-base font-semibold text-neutral-200">
              {nextScene ? `${nextScene.title} — ${nextScene.name}` : '— Fim da Apresentação —'}
            </div>
            {nextScene && (
              <div className="font-mono text-xs text-[#38bdf8] mt-1">
                Duração planejada: {nextScene.duration}s
              </div>
            )}
          </div>

          {/* Speaker notes tips */}
          <div className="bg-[#12141c] border border-white/5 rounded-xl p-4 text-xs text-neutral-400 leading-relaxed">
            <strong className="text-neutral-200 block mb-1 font-mono text-[11px] uppercase">Dica de Palco</strong>
            Use <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">Espaço</span> ou <span className="font-mono text-white bg-white/10 px-1 py-0.5 rounded">→</span> para avançar. Mantenha contato visual nos momentos com marcação de palco amarela.
          </div>
        </section>

        {/* Right column: Spoken Word Teleprompter Script */}
        <section className="lg:col-span-7 p-6 sm:p-10 overflow-y-auto flex flex-col bg-[#08080a]">
          <div className="font-mono text-xs text-[#ff2d7a] uppercase tracking-widest font-semibold mb-2">
            CENA 0{currentSceneIndex + 1} / 0{SCENES_CONFIG.length} · {currentScene.duration} SEGUNDOS
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 tracking-tight">
            {currentScene.name}
          </h2>

          <div
            className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-neutral-200 font-normal max-w-4xl space-y-4"
            dangerouslySetInnerHTML={{ __html: currentScene.script }}
          />
        </section>
      </main>

      {/* Footer Navigation Bar */}
      <footer className="bg-[#0f1118] border-t border-white/10 px-6 py-3.5 flex flex-col gap-3 z-20">
        {/* Proportional clickable timeline track */}
        <div
          className="w-full h-2.5 rounded-full bg-white/5 flex gap-1 cursor-pointer overflow-hidden"
          title="Clique para saltar para uma cena"
        >
          {SCENES_CONFIG.map((sc, i) => (
            <div
              key={i}
              onClick={() => onGoToScene(i)}
              className={`h-full transition-all duration-200 ${
                i === currentSceneIndex
                  ? 'bg-[#ff2d7a] shadow-[0_0_12px_#ff2d7a]'
                  : i < currentSceneIndex
                  ? 'bg-[#ff2d7a]/50 hover:bg-[#ff2d7a]/70'
                  : 'bg-white/15 hover:bg-white/25'
              }`}
              style={{ width: `${(sc.duration / TOTAL_DURATION_SECONDS) * 100}%` }}
              title={`${sc.title} (${sc.duration}s)`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="font-mono text-xs sm:text-sm text-neutral-400">
            Cena <strong className="text-white">{currentSceneIndex + 1}</strong> de {SCENES_CONFIG.length}:{' '}
            <span className="text-neutral-300">{currentScene.name}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onPrevScene}
              disabled={currentSceneIndex === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={onToggleTimer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-mono text-neutral-200 transition cursor-pointer"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  <span>Pausar (T)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Retomar (T)</span>
                </>
              )}
            </button>

            <button
              onClick={onResetPresentation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-mono text-neutral-300 transition cursor-pointer"
              title="Reiniciar apresentação (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar</span>
            </button>

            <button
              onClick={onOpenHelp}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 transition cursor-pointer"
              title="Atalhos (?)"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              onClick={onNextScene}
              disabled={currentSceneIndex === SCENES_CONFIG.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#ff2d7a] hover:bg-[#ff1a6e] disabled:opacity-40 disabled:hover:bg-[#ff2d7a] text-white text-xs sm:text-sm font-semibold shadow-[0_4px_18px_rgba(255,45,122,0.4)] transition cursor-pointer"
            >
              <span>Próxima</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
