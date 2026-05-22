export async function getTypeDefenses(typeName) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
  const data = await res.json()

  const defenses = {}

  data.damage_relations.double_damage_from.forEach(t => defenses[t.name] = 2)
  data.damage_relations.half_damage_from.forEach(t => defenses[t.name] = 0.5)
  data.damage_relations.no_damage_from.forEach(t => defenses[t.name] = 0)

  return defenses
}

export async function getTeamWeaknesses(team) {
  const weaknesses = {}

  for (const pokemon of team) {
    const typeDefenses = await Promise.all(
      pokemon.types.map(type => getTypeDefenses(type))
    )

    const combined = {}
    typeDefenses.forEach(defenses => {
      Object.entries(defenses).forEach(([attackType, multiplier]) => {
        combined[attackType] = (combined[attackType] || 1) * multiplier
      })
    })

    Object.entries(combined).forEach(([attackType, multiplier]) => {
      if (!weaknesses[attackType]) weaknesses[attackType] = 0
      if (multiplier >= 2) weaknesses[attackType]++
      if (multiplier <= 0.5 && multiplier > 0) weaknesses[attackType]--
      if (multiplier === 0) weaknesses[attackType] -= 2
    })
  }

  return Object.entries(weaknesses)
    .filter(([, count]) => count !== 0)
    .sort((a, b) => b[1] - a[1])
}