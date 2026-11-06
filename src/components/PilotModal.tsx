import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';

interface PilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmittedToast: () => void;
}

export const PilotModal: React.FC<PilotModalProps> = ({ isOpen, onClose, onSubmittedToast }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    role: 'Bar / Restaurante',
    shiftsPerWeek: '2 a 5 turnos'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      onSubmittedToast();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#11131a] border border-[#ff2d7a]/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff2d7a]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff2d7a]" />
            <h3 className="font-bold text-white text-lg sm:text-xl">Agendar Piloto Trampaki</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center relative z-10">
            <CheckCircle className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
            <h4 className="text-xl font-bold text-white mb-2">Solicitação Confirmada!</h4>
            <p className="text-sm text-neutral-300 max-w-sm">
              Nossa equipe de onboarding do Trampaki entrará em contato via WhatsApp nas próximas 2 horas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <p className="text-xs sm:text-sm text-neutral-400">
              Garanta uma das 10 vagas prioritárias para o programa piloto em São Paulo com taxa zero no 1º mês.
            </p>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                Nome do Estabelecimento *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Bar do Lago, Bistrô Central"
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ff2d7a] transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ricardo Rocha"
                  value={formData.contactName}
                  onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ff2d7a] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(11) 99999-9999"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#ff2d7a] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                  Tipo de Operação
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff2d7a] transition"
                >
                  <option value="Bar / Restaurante">Bar / Restaurante</option>
                  <option value="Casa Noturna / Balada">Casa Noturna / Balada</option>
                  <option value="Buffet / Eventos">Buffet / Eventos</option>
                  <option value="Hotelaria">Hotelaria</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-1">
                  Turnos / Semana
                </label>
                <select
                  value={formData.shiftsPerWeek}
                  onChange={e => setFormData({ ...formData, shiftsPerWeek: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171922] border border-white/10 text-white text-sm focus:outline-none focus:border-[#ff2d7a] transition"
                >
                  <option value="1 turno">1 turno / semana</option>
                  <option value="2 a 5 turnos">2 a 5 turnos / semana</option>
                  <option value="Mais de 5 turnos">Mais de 5 turnos / semana</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 rounded-xl bg-[#ff2d7a] hover:bg-[#ff1a6e] text-white font-bold text-sm tracking-wide shadow-[0_4px_20px_rgba(255,45,122,0.5)] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Confirmar Inscrição no Piloto</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
