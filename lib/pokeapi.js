const BASE_URL = "https://pokeapi.co/api/v2"

export async function getPokemon(nameOrId) {
  const res = await fetch(`${BASE_URL}/pokemon/${nameOrId}`)
  if (!res.ok) return null
  const data = await res.json()

  return {
    id: data.id,
    name: data.name,
    image: data.sprites.other["official-artwork"].front_default,
    types: data.types.map(t => t.type.name),
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      specialAttack: data.stats[3].base_stat,
      specialDefense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    }
  }
}

export async function searchPokemon(query) {
  const res = await fetch(`${BASE_URL}/pokemon?limit=1500&offset=0`)
  if (!res.ok) return []
  const data = await res.json()

  const filtered = data.results.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  )

  return filtered.slice(0, 8)
}