"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
};

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
};

function BuilderContent() {
  const searchParams = useSearchParams();
  const editingId = searchParams.get("teamId");

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState("Mi equipo");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editingId) return;

    async function loadTeam() {
      const res = await fetch(`/api/teams/${editingId}`);
      const data = await res.json();
      setTeamName(data.name);

      const pokemonData = await Promise.all(
        data.members
          .sort((a, b) => a.position - b.position)
          .map(async (m) => {
            const pokeRes = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${m.pokemonId}`,
            );
            const pokeData = await pokeRes.json();
            return {
              id: m.pokemonId,
              name: pokeData.name,
              image: pokeData.sprites.other["official-artwork"].front_default,
            };
          }),
      );

      setTeam(pokemonData);
    }

    loadTeam();
  }, [editingId]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/pokemon/search?q=${query}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  function addToTeam(pokemon) {
    if (team.length >= 6) return;
    if (team.find((p) => p.id === pokemon.id)) return;
    setTeam([...team, pokemon]);
  }

  function removeFromTeam(pokemonId) {
    setTeam(team.filter((p) => p.id !== pokemonId));
  }

  async function saveTeam() {
    if (team.length === 0) return;
    setSaving(true);

    const url = editingId ? `/api/teams/${editingId}` : "/api/teams";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: teamName, pokemon: team }),
    });

    if (res.ok) {
      alert(editingId ? "¡Equipo actualizado!" : "¡Equipo guardado!");
      window.location.href = "/dashboard";
    }
    setSaving(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editingId ? "Editar equipo" : "Crear equipo"}
          </h1>
          <p className="text-gray-500 mt-1">
            Busca Pokémon y construye tu equipo ideal
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          ← Volver al dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Buscar Pokémon
            </h2>
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej: charizard, pikachu..."
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>

          {loading && (
            <div className="text-center py-10 text-gray-400">Buscando...</div>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {results.map((pokemon) => {
                const inTeam = team.find((p) => p.id === pokemon.id);
                return (
                  <div
                    key={pokemon.id}
                    className={`bg-white rounded-xl border p-4 text-center transition-all ${
                      inTeam
                        ? "border-red-300 opacity-50"
                        : "border-gray-100 hover:border-red-300 hover:shadow-md cursor-pointer"
                    }`}
                    onClick={() => !inTeam && addToTeam(pokemon)}
                  >
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={80}
                      height={80}
                      className="mx-auto"
                    />
                    <p className="text-sm font-medium text-gray-800 capitalize mt-2">
                      {pokemon.name}
                    </p>
                    <div className="flex gap-1 justify-center mt-2 flex-wrap">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[type] || "bg-gray-100 text-gray-700"}`}
                        >
                          {tipoES[type] || type}
                        </span>
                      ))}
                    </div>
                    {!inTeam && team.length < 6 && (
                      <button className="mt-3 text-xs text-red-600 font-medium hover:text-red-700">
                        + Añadir
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Mi equipo
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({team.length}/6)
              </span>
            </h2>

            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent mb-4"
              placeholder="Nombre del equipo"
            />

            <div className="space-y-2 mb-6">
              {team.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  Añade Pokémon desde la búsqueda
                </p>
              ) : (
                team.map((pokemon) => (
                  <div
                    key={pokemon.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group"
                  >
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={48}
                      height={48}
                    />
                    <span className="flex-1 text-sm font-medium text-gray-700 capitalize">
                      {pokemon.name}
                    </span>
                    <button
                      onClick={() => removeFromTeam(pokemon.id)}
                      className="text-xs text-gray-300 group-hover:text-red-500 transition-colors font-medium"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}

              {Array.from({ length: 6 - team.length }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-gray-200"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 text-lg">
                    ?
                  </div>
                  <span className="text-sm text-gray-300">Vacío</span>
                </div>
              ))}
            </div>

            <button
              onClick={saveTeam}
              disabled={saving || team.length === 0}
              className="w-full bg-red-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving
                ? "Guardando..."
                : editingId
                  ? "Actualizar equipo"
                  : "Guardar equipo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="p-10 text-gray-400">Cargando...</div>}>
      <BuilderContent />
    </Suspense>
  );
}
