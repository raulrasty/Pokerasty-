import prisma from "@/lib/prisma"
import { getPokemon } from "@/lib/pokeapi"
import { getTeamWeaknesses, getTypeDefenses } from "@/lib/weakness"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"
import Image from "next/image"

const tipoES = {
  fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico",
  psychic: "Psíquico", ice: "Hielo", dragon: "Dragón", dark: "Siniestro",
  fairy: "Hada", fighting: "Lucha", poison: "Veneno", ground: "Tierra",
  flying: "Volador", bug: "Bicho", rock: "Roca", ghost: "Fantasma",
  steel: "Acero", normal: "Normal",
}

const typeColors = {
  fire: "bg-orange-100 text-orange-700",
  water: "bg-blue-100 text-blue-700",
  grass: "bg-green-100 text-green-700",
  electric: "bg-yellow-100 text-yellow-700",
  psychic: "bg-pink-100 text-pink-700",
  ice: "bg-cyan-100 text-cyan-700",
  dragon: "bg-indigo-100 text-indigo-700",
  dark: "bg-gray-800 text-white",
  fairy: "bg-pink-200 text-pink-800",
  fighting: "bg-red-100 text-red-700",
  poison: "bg-purple-100 text-purple-700",
  ground: "bg-amber-100 text-amber-700",
  flying: "bg-sky-100 text-sky-700",
  bug: "bg-lime-100 text-lime-700",
  rock: "bg-stone-100 text-stone-700",
  ghost: "bg-violet-100 text-violet-700",
  steel: "bg-slate-100 text-slate-700",
  normal: "bg-gray-100 text-gray-700",
}

export default async function TeamPage({ params }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { slug } = await params

  const team = await prisma.team.findUnique({
    where: { slug },
    include: { members: true, user: true }
  })

  if (!team) notFound()

  const pokemon = await Promise.all(
    team.members
      .sort((a, b) => a.position - b.position)
      .map(member => getPokemon(member.pokemonId))
  )

  const pokemonWithDefenses = await Promise.all(
    pokemon.map(async p => {
      const typeDefenses = await Promise.all(
        p.types.map(type => getTypeDefenses(type))
      )

      const combined = {}
      typeDefenses.forEach(defenses => {
        Object.entries(defenses).forEach(([attackType, multiplier]) => {
          combined[attackType] = (combined[attackType] || 1) * multiplier
        })
      })

      const weakTo = Object.entries(combined).filter(([, m]) => m >= 2).sort((a, b) => b[1] - a[1])
      const resistantTo = Object.entries(combined).filter(([, m]) => m <= 0.5 && m > 0).sort((a, b) => a[1] - b[1])
      const immuneTo = Object.entries(combined).filter(([, m]) => m === 0)

      return { ...p, weakTo, resistantTo, immuneTo }
    })
  )

  const weaknesses = await getTeamWeaknesses(pokemon)

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
        <p className="text-gray-500 mt-1">Equipo de <span className="font-medium text-gray-700">{team.user.name}</span></p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {pokemonWithDefenses.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 flex items-center gap-4">
              <Image src={p.image} alt={p.name} width={80} height={80} />
              <div>
                <h3 className="font-bold text-gray-900 capitalize text-lg">{p.name}</h3>
                <div className="flex gap-1 mt-1">
                  {p.types.map(type => (
                    <span key={type} className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[type] || "bg-gray-100 text-gray-700"}`}>
                      {tipoES[type] || type}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">
              {p.weakTo.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Débil a</p>
                  <div className="flex flex-wrap gap-1">
                    {p.weakTo.map(([type, m]) => (
                      <span key={type} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                        {tipoES[type] || type} x{m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {p.resistantTo.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Resiste</p>
                  <div className="flex flex-wrap gap-1">
                    {p.resistantTo.map(([type, m]) => (
                      <span key={type} className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">
                        {tipoES[type] || type} x{m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {p.immuneTo.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Inmune a</p>
                  <div className="flex flex-wrap gap-1">
                    {p.immuneTo.map(([type]) => (
                      <span key={type} className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
                        {tipoES[type] || type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Análisis global del equipo</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {weaknesses.map(([type, count]) => (
            <div
              key={type}
              className={`rounded-lg px-4 py-3 flex items-center justify-between ${
                count > 0 ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"
              }`}
            >
              <span className="text-sm font-medium text-gray-700">
                {tipoES[type] || type}
              </span>
              <span className={`text-sm font-bold ${count > 0 ? "text-red-500" : "text-green-600"}`}>
                {count > 0 ? `${count} débiles` : `${Math.abs(count)} resisten`}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}