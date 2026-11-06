import React from 'react';
import { Monitor, UserCheck, Maximize, ExternalLink, HelpCircle } from 'lucide-react';
import { ViewMode } from '../types/presentation';

interface ModeToolbarProps {
  currentMode: ViewMode;
  onSetMode: (mode: ViewMode) => void;
  onOpenPresenterWindow: () => void;
  onToggleFullscreen: () => void;
  onOpenHelp: () => void;
}

export const ModeToolbar: React.FC<ModeToolbarProps> = ({
  currentMode,
  onSetMode,
  onOpenPresenterWindow,
  onToggleFullscreen,
  onOpenHelp,
}) => {
  return (
    <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 flex items-center gap-1.5 p-1.5 rounded-xl bg-[#101118]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
      {/* Mode Switcher */}
      <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/5">
        <button
          onClick={() => onSetMode('audience')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition cursor-pointer ${
            currentMode === 'audience'
              ? 'bg-[#ff2d7a] text-white font-semibold shadow-[0_0_12px_rgba(255,45,122,0.4)]'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Modo Plateia (Slides em tela cheia)"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Plateia</span>
        </button>

        <button
          onClick={() => onSetMode('presenter')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition cursor-pointer ${
            currentMode === 'presenter'
              ? 'bg-[#ff2d7a] text-white font-semibold shadow-[0_0_12px_rgba(255,45,122,0.4)]'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Modo Apresentador (Teleprompter e cronômetro)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Apresentador</span>
        </button>
      </div>

      <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

      {/* Open external window */}
      <button
        onClick={onOpenPresenterWindow}
        className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
        title="Abrir Console do Apresentador em Nova Janela (P)"
      >
        <ExternalLink className="w-4 h-4" />
      </button>

      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
        title="Alternar Tela Cheia (F)"
      >
        <Maximize className="w-4 h-4" />
      </button>

      {/* Shortcuts */}
      <button
        onClick={onOpenHelp}
        className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
        title="Atalhos do Teclado (?)"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
};
