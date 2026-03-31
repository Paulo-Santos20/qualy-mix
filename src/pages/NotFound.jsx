// src/pages/NotFound.jsx
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="text-8xl mb-6">🛒</div>
      <h1 className="text-4xl font-black text-gray-900 mb-3">Página não encontrada</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-3 rounded-xl transition-colors"
      >
        ← Voltar para o início
      </Link>
    </div>
  )
}
