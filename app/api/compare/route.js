import prisma from "@/lib/prisma"
import { getPokemon } from "@/lib/pokeapi"
import { getTypeDefenses } from "@/lib/weakness"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const slug1 = searchParams.get("team1")
  const slug2 = searchParams.get("team2")

  if (!slug1 || !slug2) return Response.json({ error: "Faltan equipos" }, { status: 400 })

  const [team1, team2] = await Promise.all([
    prisma.team.findUnique({ where: { slug: slug1 }, include: { members: true, user: true } }),
    prisma.team.findUnique({ where: { slug: slug2 }, include: { members: true, user: true } }),
  ])

  if (!team1 || !team2) return Response.json({ error: "Equipo no encontrado" }, { status: 404 })

  const [pokemon1, pokemon2] = await Promise.all([
    Promise.all(team1.members.sort((a, b) => a.position - b.position).map(m => getPokemon(m.pokemonId))),
    Promise.all(team2.members.sort((a, b) => a.position - b.position).map(m => getPokemon(m.pokemonId))),
  ])

  const defenses1 = await Promise.all(
    pokemon1.map(async p => {
      const typeDefenses = await Promise.all(p.types.map(t => getTypeDefenses(t)))
      const combined = {}
      typeDefenses.forEach(def => {
        Object.entries(def).forEach(([type, mult]) => {
          combined[type] = (combined[type] || 1) * mult
        })
      })
      return combined
    })
  )

  // Cada celda devuelve un array con {type, mult} por cada tipo del atacante
  const matrix = pokemon2.map((attacker, i) =>
    pokemon1.map((defender, j) =>
      attacker.types.map(atkType => ({
        type: atkType,
        mult: defenses1[j][atkType] ?? 1
      }))
    )
  )

  const summary = pokemon1.map((defender, j) => {
    const best = matrix.map(row => Math.max(...row[j].map(t => t.mult)))
    const avg = best.reduce((a, b) => a + b, 0) / best.length
    return {
      pokemon: defender.name,
      image: defender.image,
      avg: Math.round(avg * 100) / 100,
      multipliers: best,
    }
  })

  return Response.json({
    team1: { name: team1.name, slug: team1.slug, owner: team1.user.name, pokemon: pokemon1 },
    team2: { name: team2.name, slug: team2.slug, owner: team2.user.name, pokemon: pokemon2 },
    matrix,
    summary,
  })
}