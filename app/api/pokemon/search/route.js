import { searchPokemon, getPokemon } from "@/lib/pokeapi"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) return Response.json([])

  const results = await searchPokemon(query)

  const pokemonData = await Promise.all(
    results.map(p => getPokemon(p.name))
  )

  return Response.json(pokemonData.filter(Boolean))
}