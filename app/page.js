import Link from "next/link"

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Crea tu equipo<br />
            <span className="text-red-600">Pokémon perfecto</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mb-8">
            Construye equipos, analiza debilidades y compáralos con otros entrenadores. Todo en un solo lugar.
          </p>
          <div className="flex gap-4">
            <Link
              href="/builder"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
            >
              Crear equipo
            </Link>
            <Link
              href="/dashboard"
              className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:border-red-300 hover:text-red-600 transition-colors"
            >
              Mis equipos
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">¿Qué puedes hacer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl font-bold">+</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Crea equipos</h3>
            <p className="text-gray-500 text-sm">Busca entre más de 1000 Pokémon y construye tu equipo ideal de 6.</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl font-bold">↗</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analiza debilidades</h3>
            <p className="text-gray-500 text-sm">Ve las debilidades y resistencias de cada Pokémon y del equipo completo.</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-red-600 text-2xl font-bold">⇄</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Compara equipos</h3>
            <p className="text-gray-500 text-sm">Enfrenta dos equipos y descubre cómo resiste el tuyo frente al rival.</p>
          </div>
        </div>
      </div>
    </div>
  )
}