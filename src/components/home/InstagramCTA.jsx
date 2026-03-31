// src/components/home/InstagramCTA.jsx
import InstagramIcon from '@/components/icons/InstagramIcon'

export default function InstagramCTA({ onOpen }) {
  return (
    <div className="mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-red-700 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

      <div className="relative z-10">
        <div className="flex justify-center mb-3">
          <div className="bg-white/20 rounded-full p-3">
            <InstagramIcon className="w-7 h-7 text-white" />
          </div>
        </div>
        <p className="text-orange-100 font-bold text-xs uppercase tracking-widest mb-1">
          Powered by Gemini + Groq AI
        </p>
        <h2 className="text-white font-black text-xl sm:text-2xl mb-2">
          Gere Posts para o Instagram com IA
        </h2>
        <p className="text-orange-100 text-sm mb-5 max-w-md mx-auto">
          Selecione produtos, escreva o tema e a IA cria legenda completa,
          conceito visual e sequência de Stories — em segundos.
        </p>
        <button
          onClick={onOpen}
          className="bg-white text-red-600 font-black px-8 py-3 rounded-xl hover:bg-orange-50 active:scale-95 transition-all shadow-lg"
        >
          ✨ Criar Post Agora
        </button>
      </div>
    </div>
  )
}
