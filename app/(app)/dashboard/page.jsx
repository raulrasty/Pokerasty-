"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function DashboardPage() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => {
        setTeams(data)
        setLoading(false)
      })
  }, [])

  async function deleteTeam(id) {
    if (!confirm("¿Seguro que quieres borrar este equipo?")) return
    await fetch(`/api/teams/${id}`, { method: "DELETE" })
    setTeams(teams.filter(t => t.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis equipos</h1>
          <p className="text-gray-500 mt-1">Gestiona y comparte tus equipos Pokémon</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/compare"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:border-red-400 hover:text-red-600 transition-colors"
          >
            Comparar equipos
          </Link>
          <Link
            href="/builder"
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
          >
            + Crear equipo
          </Link>
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando equipos...</div>
      ) : teams.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No tienes equipos todavía</h2>
          <p className="text-gray-400 mb-6">Crea tu primer equipo y empieza a competir</p>
          <Link
            href="/builder"
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Crear mi primer equipo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => (
            <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">

              {/* Cabecera tarjeta */}
              <div className="bg-gradient-to-r from-red-600 to-red-500 px-5 py-4">
                <h2 className="text-white font-bold text-lg truncate">{team.name}</h2>
                <p className="text-red-100 text-sm">{team.members.length}/6 Pokémon</p>
              </div>

              {/* Sprites del equipo */}
              <div className="px-5 py-4 flex gap-1 flex-wrap min-h-[80px] items-center">
                {team.members.length === 0 ? (
                  <p className="text-gray-400 text-sm">Equipo vacío</p>
                ) : (
                  team.members
                    .sort((a, b) => a.position - b.position)
                    .map(member => (
                      <Image
                        key={member.id}
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${member.pokemonId}.png`}
                        alt={`Pokemon ${member.pokemonId}`}
                        width={48}
                        height={48}
                        className="pixelated"
                      />
                    ))
                )}
              </div>

              {/* Acciones */}
              <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                <Link
                  href={`/team/${team.slug}`}
                  className="text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
                >
                  Ver equipo →
                </Link>
                <div className="flex gap-2">
                  <Link
                    href={`/builder?teamId=${team.id}`}
                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-red-300 hover:text-red-600 transition-colors"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="text-xs px-3 py-1.5 border border-gray-200 text-gray-400 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors"
                  >
                    Borrar
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}