"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const tipoES = {
  fire: "Fuego",
  water: "Agua",
  grass: "Planta",
  electric: "Eléctrico",
  psychic: "Psíquico",
  ice: "Hielo",
  dragon: "Dragón",
  dark: "Siniestro",
  fairy: "Hada",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  bug: "Bicho",
  rock: "Roca",
  ghost: "Fantasma",
  steel: "Acero",
  normal: "Normal",
}

function getColorClass(multiplier) {
  if (multiplier === 0) return "bg-gray-500 text-white"
  if (multiplier <= 0.5) return "bg-green-500 text-white"
  if (multiplier === 1) return "bg-gray-200 text-gray-700"
  if (multiplier === 2) return "bg-orange-400 text-white"
  if (multiplier >= 4) return "bg-red-500 text-white"
  return "bg-gray-200 text-gray-700"
}

export default function ComparePage() {
  const [myTeams, setMyTeams] = useState([])
  const [team1Slug, setTeam1Slug] = useState("")
  const [team2Slug, setTeam2Slug] = useState("")
  const [team2Custom, setTeam2Custom] = useState("")
  const [useCustom, setUseCustom] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/teams")
      .then(res => res.json())
      .then(data => setMyTeams(data))
  }, [])

  async function compare() {
    const slug2 = useCustom ? team2Custom.trim() : team2Slug
    if (!team1Slug || !slug2) {
      setError("Selecciona los dos equipos")
      return
    }
    setError("")
    setLoading(true)
    const res = await fetch(`/api/compare?team1=${team1Slug}&team2=${slug2}`)
    const data = await res.json()
    if (data.error) {
      setError(data.error)
      setLoading(false)
      return
    }
    setResult(data)
    setLoading(false)
  }

  const avgGlobal = result
    ? result.summary.reduce((a, b) => a + b.avg, 0) / result.summary.length
    : null

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Comparar equipos</h1>
        <p className="text-gray-500 mt-1">Analiza cómo resiste tu equipo frente al rival</p>
      </div>

      {/* Selectores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Equipo defensor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Equipo defensor (tuyo)
            </label>
            <select
              value={team1Slug}
              onChange={e => setTeam1Slug(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Selecciona un equipo</option>
              {myTeams.map(t => (
                <option key={t.id} value={t.slug}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* Equipo atacante */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Equipo atacante
            </label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  checked={!useCustom}
                  onChange={() => setUseCustom(false)}
                  className="accent-red-600"
                />
                Mis equipos
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  checked={useCustom}
                  onChange={() => setUseCustom(true)}
                  className="accent-red-600"
                />
                Slug de otro usuario
              </label>
            </div>
            {!useCustom ? (
              <select
                value={team2Slug}
                onChange={e => setTeam2Slug(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Selecciona un equipo</option>
                {myTeams.map(t => (
                  <option key={t.id} value={t.slug}>{t.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Pega el slug del equipo"
                value={team2Custom}
                onChange={e => setTeam2Custom(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <div className="mt-6">
          <button
            onClick={compare}
            disabled={loading}
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Analizando..." : "Comparar equipos"}
          </button>
        </div>
      </div>

      {/* Resultados */}
      {result && (
        <div className="space-y-8">

          {/* Resumen global */}
          <div className={`rounded-xl p-5 border ${
            avgGlobal < 0.8
              ? "bg-green-50 border-green-200"
              : avgGlobal > 1.5
              ? "bg-red-50 border-red-200"
              : "bg-yellow-50 border-yellow-200"
          }`}>
            <p className="font-semibold text-gray-800 text-lg">
              {avgGlobal < 0.8
                ? "Tu equipo resiste bien al rival"
                : avgGlobal > 1.5
                ? "Tu equipo tiene serios problemas contra este rival"
                : "Matchup equilibrado"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Media de daño recibido: <strong>x{Math.round(avgGlobal * 100) / 100}</strong> —
              {" "}{result.team2.name} atacando a {result.team1.name}
            </p>
          </div>

          {/* Resumen por Pokémon */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resistencia por Pokémon</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {result.summary.map((s, j) => (
                <div key={j} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                  <Image src={s.image} alt={s.pokemon} width={64} height={64} className="mx-auto" />
                  <p className="text-xs font-medium text-gray-700 capitalize mt-2">{s.pokemon}</p>
                  <p className={`text-sm font-bold mt-1 ${
                    s.avg > 1 ? "text-red-500" : s.avg < 1 ? "text-green-500" : "text-gray-500"
                  }`}>
                    x{s.avg}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla matchups */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Tabla de matchups</h2>
            <p className="text-sm text-gray-500 mb-4">Filas = atacantes · Columnas = defensores</p>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="border-collapse w-full">
                <thead>
                  <tr>
                    <th className="p-3"></th>
                    {result.team1.pokemon.map(p => (
                      <th key={p.id} className="p-3 text-center">
                        <Image src={p.image} alt={p.name} width={48} height={48} className="mx-auto" />
                        <p className="text-xs text-gray-600 capitalize mt-1">{p.name}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.team2.pokemon.map((attacker, i) => (
                    <tr key={attacker.id} className="border-t border-gray-100">
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-gray-600 capitalize">{attacker.name}</span>
                          <Image src={attacker.image} alt={attacker.name} width={36} height={36} />
                        </div>
                      </td>
                      {result.matrix[i].map((cell, j) => (
                        <td key={j} className="p-2 text-center">
                          {cell.map((t, k) => (
                            <div
                              key={k}
                              className={`text-xs font-bold rounded px-2 py-0.5 mb-1 ${getColorClass(t.mult)}`}
                            >
                              {tipoES[t.type] || t.type}: x{t.mult}
                            </div>
                          ))}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}