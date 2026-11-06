import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { label: 'Avançar cena', keys: ['→', 'Espaço', 'Enter'] },
    { label: 'Voltar cena', keys: ['←'] },
    { label: 'Alternar Modo Apresentador', keys: ['P'] },
    { label: 'Alternar Tela Cheia', keys: ['F'] },
    { label: 'Pausar / Retomar Cronômetro', keys: ['T'] },
    { label: 'Reiniciar Pitch', keys: ['R'] },
    { label: 'Saltar para Cena 1-8', keys: ['1', '..', '8'] },
    { label: 'Abrir / Fechar Atalhos', keys: ['?', 'Esc'] },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#11131a] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5 font-bold text-white text-lg">
            <Keyboard className="w-5 h-5 text-[#ff2d7a]" />
            <span>Atalhos da Apresentação</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
              <span className="text-neutral-300">{sc.label}</span>
              <div className="flex gap-1.5 font-mono">
                {sc.keys.map((k, kidx) => (
                  <kbd
                    key={kidx}
                    className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white text-xs font-semibold shadow-sm"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition cursor-pointer"
        >
          Entendi, voltar à apresentação
        </button>
      </div>
    </div>
  );
};
