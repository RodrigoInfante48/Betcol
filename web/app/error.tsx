'use client'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p className="text-5xl mb-4">⚠️</p>
      <h2 className="text-xl font-bold text-white mb-2">Algo salió mal</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">{error.message || 'Error inesperado al cargar esta página.'}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Reintentar
        </button>
        <Link href="/" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-lg transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
